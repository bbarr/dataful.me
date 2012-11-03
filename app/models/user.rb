class User
  include MongoMapper::Document

  before_create :encrypt_password

  attr_accessor :password

  key :_id, String, {
    :format => /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\Z/i
  }
  key :encrypted_password, String
  alias :email :_id

  many :entries
  many :stats

  def authenticate password
    BCrypt::Password.new(self.encrypted_password) == password
  end

  private

    def encrypt_password
      self.encrypted_password = BCrypt::Password.create(self.password) 
    end

end
