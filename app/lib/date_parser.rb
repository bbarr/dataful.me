module DateParser

  def parse_time val
    DateParser::Time.new(val)
  end

  def parse_date val
    DateParser::Date.new(val)
  end
end

class DateParser::Object

  attr_accessor :str, :obj

  def initailize val
    @str = val
    @obj = Date.new
    if detect_range
      generate_range
    else
      generate_date
    end
  end

  def generate_range
  end

  def generate_date
  end

  def detect_range
    @str[/<|>/]
  end

  def breakup_range
    @str.scan(/(<|>)(\w:\/)/)
  end

  def generate_range
    breakup_range.reduce({}) { |ranges, range| ranges[range.first] = range.last }
  end
end

class DateParser::Time < DateParser::Object
  
  def generate_range
    range = super

  end
end

class DateParser::Date < DateParser::Object

end
