Warden::Manager.serialize_into_session{ |user| user.id }
Warden::Manager.serialize_from_session{ |id| User.find(id) }

Warden::Strategies.add(:password) do
  
  def valid?
    params['email'] && params['password']
  end
  
  def authenticate!
    user = User.find_by_email(params['email'])
    if user
      if user.authenticate params['password']
        success!(user)
      else
        errors.add(:password, "Password incorrect")
      end
    else
      errors.add(:email, 'Email not found')
      fail!    
    end
  end
end
