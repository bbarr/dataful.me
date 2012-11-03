class MainController < BaseController

  get "/" do
    content_type :html
    file_name = current_user ? 'dashboard' : 'index'
    File.read(settings.public_folder + "/#{file_name}.html")
  end

  post "/unauthenticated" do
    halt 401
  end
end
