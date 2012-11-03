class Entry
  include MongoMapper::Document

  attr_accessor :raw

  before_validation :parse

  timestamps!
  key :category, String, :required => true
  key :tags, Object, :default => {}

  belongs_to :user

  private

    def parse
      chunks = raw.split(' ')
      self.category = chunks.shift
      self.tags = parse_tags(chunks)
    end

    def parse_tags tags
      tags.reduce({}) do |tag_hash, tag|
        key, val = tag.split(':')
        tag_hash[key] = val || key
        tag_hash
      end
    end
end
