class SessionController < BaseController

  get "/" do
    if current_user
      ok
    else
      missing
    end
  end

  post "/" do
    env['warden'].authenticate!
    ok
  end

  delete "/" do
    env['warden'].logout
    ok
  end
end
