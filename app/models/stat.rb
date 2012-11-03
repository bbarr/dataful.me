class Stat
  include MongoMapper::Document

  before_validation :format, :parse

  key :raw, String, required: true
  key :type, String, required: true
  key :subject, Object, required: true
  key :query, Object, required: true
  key :relations, Object

  belongs_to :user

  RE = /\A(\w+) '(\w+)'(?: from '(\w+)')?(?: where '([\w:]+)')?(?: within (\d+\w) (of|after|before) '([\w+:]+)')?/
  
  def format
    self.raw = raw.downcase.gsub('"', "'")
  end

  def value
    @value ||= process
  end

  def serializable_hash(options = {})
    hash = super(options)
    hash[:value] = value
    hash
  end

  def process
    entries = get_entries
    entries = apply_relations(entries)
    self.send("process_#{type}", entries)
  end

  def process_count entries
    return '' unless subject['category']
    entries.count
  end

  def process_average entries
    tag = subject['tag']

    return '' if tag.nil?

    tag_values = entries.map { |e| e.tags }.map { |t| t[tag] }
    if tag_values.first =~ /\A\d+\Z/
      calculate_average(tag_values)
    else 
      calculate_most_common(tag_values)
    end
  end

  def calculate_average items
    items.map { |i| i.to_i }.reduce(:+) / items.length
  end

  def calculate_most_common items
    cache = {}
    count = 0
    items.each do |item|
      cache[item] ||= 0
      cache[item] += 1
      count += 1
    end
    cache.map do |k, v|
      [ k, (v.to_f / count.to_f * 100).round ]
    end
  end

  def apply_relations entries
    entries
  end

  def get_entries
    Entry.where(query)
  end

  def merge_string_into_query query, string
    return query if string.empty?

    string.split(' ').each do |condition|
      name, value = condition.split(':')
      if value
        if name == 'time'
          query["created_at"] = ''
        else
          query["tags.#{name}"] = value
        end
      else
        query[:category] = name
      end
    end

    query
  end

  def parse
    match = RE.match(raw)
    return if match.nil?
    
    parse_type match
    parse_query match
    parse_subject match
    parse_relations match
  end

  def parse_type match
    self.type = match[1]
  end

  def parse_subject match
    self.subject = match[3].nil? ? { category: match[2] } : { tag: match[2] }
    p subject
  end

  def parse_query match
    self.query = {}
    if match[3].nil?
      query[:category] = match[2]
      query[:tags] = {}
    else
      query[:category] = match[3]
      query["tags.#{match[2]}"] = { :$exists => true }
    end
    merge_string_into_query(query, match[4]) unless match[4].nil?
  end

  def parse_relations match
    return if match[5].nil?

    self.relations = {
      range: match[5],
      direction: match[6],
      target: match[7] 
    }
  end
end
