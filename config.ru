require "./app/boot"

map "/" do
  run MainController
end

map "/entries" do
  run EntriesController
end

map "/stats" do
  run StatsController
end

map "/user" do
  run UserController
end

map "/session" do
  run SessionController
end
