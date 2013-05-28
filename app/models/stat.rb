class Statistic
  include MongoMapper::Document

  key :raw, String, required: true

  belongs_to :user

  def value(limiting_date=nil)
    begin
      Statician.new(user).calculate(raw, limiting_date)
    rescue
      {}
    end
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
