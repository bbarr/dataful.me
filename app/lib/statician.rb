module Parser

  class Relation
    
    attr_accessor :subject, :direction, :distance

    def initialize config
      public_send(:"#{config[:key]}=", config[:value])
    end

    def to_hash
      {
        direction: @direction,
        distance: @distance,
        subject: @subject.to_hash
      }
    end
  end

  class Subject

    attr_accessor :tags, :relations, :unresolved_tag
    
    def initialize token
      @tags = {}
      @unresolved_tag = false
      @relations = []
      add_tag token
    end

    def to_hash
      {
        tags: @tags,
        relations: @relations.map(&:to_hash)
      }
    end

    def add_tag token
      if @unresolved_tag
        @unresolved_tag = false
        @tags[@last_tag_key] = token.value
      else
        @last_tag_key = token.value.to_sym
        @tags[@last_tag_key] = @last_tag_key
      end
    end

    def add_relation config
      relation = @relations.last
      if relation && relation.send(config[:key]).nil?
        relation.send(:"#{config[:key]}=", config[:value])
      else
        @relations << Relation.new(config)
      end
    end
  end

  def parse tokens
    setup_parser
    tokens.each do |t|
      self.send("parse_#{t.name}", t)
    end
    parsed_hash
  end

  private

    def parsed_hash
      {
        action: @action,
        action_conditions: @action_conditions,
        subject: @subject.to_hash
      }
    end

    def setup_parser
      @active_subject_depth = 0
    end

    def active_subject
      active = @subject
      return unless active
      @active_subject_depth.times do
        if active.relations.last && active.relations.last.subject
          active = active.relations.last.subject
        end
      end
      active
    end

    def parse_word token
      if @action.nil?
        @action = token.value
      elsif @subject.nil? && @active_subject_depth == 0
        @subject = Subject.new(token)
      elsif active_subject && active_subject.relations.last && active_subject.relations.last.direction && active_subject.relations.last.subject.nil?
        active_subject.add_relation({ key: :subject, value: Subject.new(token) })
      elsif @active_subject_depth >= 0
        if active_subject
          active_subject.add_tag(token)
        else
          @action_conditions = token.value
        end
      else
        throw 'some sort of syntax error'
      end
    end

    def parse_relation_distance token
      active_subject.add_relation({ key: :distance, value: token.value })
    end

    def parse_relation_direction token
      active_subject.add_relation({ key: :direction, value: token.value })
    end

    def parse_relation_subject token
      active_subject.add_relation({ key: :subject, value: Subject.new(token) })
    end

    def parse_time token
      active_subject.add_tag(token)
    end

    def parse_colon token
      active_subject.unresolved_tag = true
    end

    def parse_open_parens token
      @active_subject_depth += 1
    end

    def parse_close_parens token
      @active_subject_depth -= 1
    end
end

module Tokenizer

  class Token

    attr_accessor :match, :name, :value
    
    def initialize config
      @match = config[:match]
      @name = config[:name]
      @value = @match[0]
    end
  end
  
  TOKENS = {
    date: /\A(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?/,
    time: /\A(\d{1,2})(?:(?::)(\d{2}))?(am|pm)/i,
    relation_distance: /\A(\d+)(h|d|w|m)/i,
    relation_direction: /\A(before|after)/i,
    open_parens: /\A\(/,
    close_parens: /\A\)/,
    colon: /\A:/,
    gt: /\A>/,
    lt: /\A</,
    word: /\A(\w+)\b/
  }

  def tokenize raw
    setup_tokenizer raw
    until @string.empty?
      TOKENS.each do |name, re| 
        if match = re.match(@string)
          @matches << { name: name, match: match }
        end
      end
      flush
    end
    @tokens
  end

  private

    def setup_tokenizer raw
      @raw_string = raw
      @string = raw.dup
      @tokens = []
      @matches = []
    end

    def flush
      unless @matches.empty?
        longest_match = @matches.max_by { |m| m[:match][0].length }
        token = Token.new(longest_match)
        @tokens << token
        @string = @string[token.value.length..-1].strip
        @matches = []
      end
    end
end

module Queryizer

  def queryize hash
    query = {}
    hash[:subject][:tags].each { |k, v| add_tag(query, k, v) }
    hash[:subject][:relations].each { |r| add_relation(query, r) }
    query
  end

  private

    def add_tag query, key, value
      if key == value
        value = { '$exists' => true }
      else
        sym = value[0]
        sym += value[1] if value[1] == '='
        if sym == '<'
          value = { '$lt' => value[1..-1] }
        elsif sym == '<='
          value = { '$lte' => value[2..-1] }
        elsif sym == '>'
          value = { '$gt' => value[1..-1] }
        elsif sym == '>='
          value = { '$gte' => value[2..-1] }
        end
      end

      query["tags.#{key}"] = value
    end

    def add_relation query, relation
      
      relation_query = {}

      relation[:subject][:tags].each { |k, v| add_tag(relation_query, k, v) }
      entries = @user.entries.where(relation_query)

      seconds = date_range_in_seconds(relation[:distance] || '24h')
      create_date_range = Proc.new do |date|
        if relation[:direction] == 'after'
          { created_at: { "$gt" => date, "$lt" => date + seconds } }
        else
          { created_at: { "$gt" => date - seconds, "$lt" => date } }
        end
      end 
      date_ranges = entries.map { |e| create_date_range.call(e.created_at) }
      if date_ranges.empty?
        query[:NO_QUERY] = true
      end
      query["$or"] = date_ranges
    end

    def date_range_in_seconds range

      ranges = { h: 3600 }
      ranges[:d] = ranges[:h] * 24
      ranges[:w] = ranges[:d] * 7
      ranges[:m] = ranges[:d] * 30
      
      range_key = range[-1].to_sym
      multiple = range.chop

      ranges[range_key] * (multiple.to_i)
    end
end

class Statician
  include Tokenizer
  include Parser
  include Queryizer

  def initialize user
    @user = user
  end

  def calculate raw, end_limiting_date=nil

    tokens = tokenize(raw)
    hash = parse(tokens)

    if hash[:action_conditions] == 'daily'
      end_limiting_date ||= Time.now.utc.end_of_day
      start_limiting_date = end_limiting_date.midnight
    end

    @action = hash[:action]
    @subject_value = hash[:subject][:tags].find { true }.first.to_s

    query = queryize(hash)
    query[:created_at] = { "$lt" => end_limiting_date } if end_limiting_date
    query[:created_at]["$gt"] = start_limiting_date if start_limiting_date

    entries = query[:NO_QUERY] ? [] : @user.entries.where(query)
    process(entries)
  end

  def process entries
    self.send("process_#{@action}", entries)
  end

  def process_count entries
    entries.count
  end

  def process_average entries
    return '' if entries.empty?
    tag_values = entries.map { |e| e.tags[@subject_value] }.compact
    calculate_average(tag_values)
  end

  def process_usual entries
    return '' if entries.empty?
    tag_values = entries.map { |e| e.tags[@subject_value] }.compact
    calculate_usual(tag_values)
  end

  def process_sum entries
    tag_values = entries.map { |e| e.tags[@subject_value] }.compact
    calculate_sum(tag_values)
  end

  def calculate_sum items
    items.map { |i| i.to_f }.reduce(:+)
  end

  def calculate_average items
    (calculate_sum(items) / items.length).round(2)
  end

  def calculate_usual items
    cache = {}
    items.each do |item| 
      cache[item] ||= 0 
      cache[item] += 1 
    end
    values = {}
    cache.each do |k, v|
      values[k] = (v / items.count.to_f * 100).round
    end
    values
  end
end
