class Entry
  include MongoMapper::Document

  attr_accessor :raw

  before_validation :parse

  timestamps!
  key :tags, Object, :default => {}

  belongs_to :user

  private

    def parse
      chunks = raw.split(' ')
      self.tags = parse_tags(chunks)
      self.created_at = generate_created_at unless @custom_timing.empty?
    end

    def parse_tags tags
      tags.reduce({}) do |tag_hash, tag|
        tag_parts = tag.split(':')
        key = tag_parts.shift
        val = tag_parts.join(':')
        if key == 'TIME' || key == 'DATE'
          @custom_timing[key.downcase.to_sym] = val
        else
          tag_hash[key] = val || key
        end
        tag_hash
      end
    end

    def generate_created_at
      date = @custom_timing[:date] ? DateTime.parse(@custom_timing[:date]) : DateTime.new 
      if time = @custom_timing[:time]
        hours, minutes, seconds = time.split(':')
        date.change({ hours: hours, minutes: minutes, seconds: seconds })
      end
      date
    end
end
