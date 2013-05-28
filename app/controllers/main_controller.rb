class MainController < BaseController

  get "/" do
    content_type :html
    if current_user
      redirect to("/dashboard")
    else
      erb :index
    end
  end

  get "/dashboard" do
    content_type :html
    if current_user
      @tag_keys = Entry.tag_keys_for(current_user)
      erb :dashboard
    else
      redirect to("/")
    end
  end

  post "/unauthenticated" do
    errored env['warden'].errors.to_hash
  end
end
