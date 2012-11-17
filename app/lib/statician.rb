module Statician

  PARTS = {
    intro: /\A(\w+) (\w+)(?: \((\w+)))?/,
    where: / where ([\w><:]+)(?: within .*)?/,
    within: / within (\d+\w) (after|before) ([\w><:]+)(?: where .*)?/
  }
    
  def calculate raw
    query = parse(raw)
    entries = query[:NO_QUERY] ? [] : self.user.entries.where(query)
    process entries
  end

  def parse raw
    query = {}
    PARTS.each do |k, v|
      match = v.match(raw)
      unless match.nil? || match.captures.compact.empty?
        self.send("parse_#{k}", query, match.captures)
      end
    end
    query
  end

  def parse_intro query, matches

    action, subject, category = matches

    @action = action

    if category
      query[:category] = category
      query["tags.#{subject}"] = { "$exists" => true }
    else
      query[:category] = subject
    end
  end

  def parse_where query, matches

    return if matches.nil?

    conditions = matches.first
    conditions_array = conditions.split(' ')

    if conditions_array.first[':'].nil? && query[:category].nil?
      query[:category] = conditions_array.shift
    end

    conditions_array.each do |condition|

      parts = condition.split(':')
      key = parts[0]
      value = parts[1]

      if value
        sym = value[0]
        if sym == '<'
          value = { '$lt' => value[1..-1] }
        elsif sym == '>'
          value = { '$gt' => value[1..-1] }
        end
      else
        value = { '$exists' => true }
      end

      query["tags.#{key}"] = value
    end
  end

  def parse_within query, matches

    return if matches.nil?

    range, direction, where = matches

    relation_query = {}
    parse_where(relation_query, [ where ]) 
    entries = self.user.entries.where(relation_query)

    seconds = date_range_in_seconds(range)
    create_date_range = Proc.new do |date|
      if direction == 'after'
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

  def process entries
    self.send("process_#{@action}", entries)
  end

  def process_count entries
    entries.count
  end

  def process_average entries

    tag_values = entries.map { |e| e.tags[@subject] }.compact

    if tag_values.first =~ /\A[\d\.]+\Z/
      return 0 if tag_values.empty?
      calculate_average(tag_values)
    else 
      return "" if tag_values.empty?
      calculate_most_common(tag_values)
    end
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
  
  def calculate_average items
    items.map { |i| i.to_f }.reduce(:+) / items.length
  end

  def calculate_most_common items
    cache = {}
    items.each do |item| 
      cache[item] ||= 0 
      cache[item] += 1 
    end
    most_common = cache.max
    [ most_common[0], (most_common[1] / items.count.to_f * 100).round ]
  end

end
