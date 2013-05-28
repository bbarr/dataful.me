class User
  include MongoMapper::Document

  before_create :encrypt_password

  validate :match_passwords
  validates_presence_of :email, :message => 'Email cannot be blank'
  validates_format_of :email, :with => /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\Z/i, :on => :create, :message => 'Email is not valid'
  validates_presence_of :password, :message => 'Password cannot be blank'

  attr_accessor :password
  key :email, String
  key :encrypted_password, String

  many :entries
  many :statistics

  def match_passwords
    p email
    errors.add(:confirm_password, "Confirm password doesn't match password") unless password == confirm_password
  end

  def authenticate password
    BCrypt::Password.new(self.encrypted_password) == password
  end

  private

    def encrypt_password
      self.encrypted_password = BCrypt::Password.create(self.password) 
    end

end
