class UserController < BaseController

  get "/" do
    if current_user
      ok current_user
    else
      missing
    end
  end

  post "/" do
    user = User.new params
    if user.save
      env['warden'].set_user(user)
      created user
    else
      errored user
    end
  end
end
