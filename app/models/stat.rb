class Stat
  include MongoMapper::Document
  include Statician

  before_validation :format

  key :raw, String, required: true

  belongs_to :user

  def format
    self.raw = raw.downcase.gsub('"', "'")
  end

  def value
    @value ||= calculate(raw)
  end

  def serializable_hash options={}
    hash = super(options)
    hash[:value] = value
    hash
  end

end
