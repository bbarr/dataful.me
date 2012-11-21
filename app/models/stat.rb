class Stat
  include MongoMapper::Document

  key :raw, String, required: true

  belongs_to :user

  def value(limiting_date=nil)
    Statician.new(user).calculate(raw, limiting_date)
  end

  def action
    raw.split(' ')[0]
  end

  def serializable_hash options={}
    hash = super(options)
    hash[:value] = value
    hash
  end

end
