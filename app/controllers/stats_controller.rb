class StatsController < BaseController

  requires_user

  get "/" do
    ok current_user.stats
  end

  post "/" do
    stat = current_user.stats.build params
    if stat.save
      created stat
    else
      errored stat
    end
  end

  get "/:id" do
    stat = current_user.stats.find params[:id]
    if stat
      ok stat
    else
      missing
    end
  end

  delete "/:id" do
    stat = current_user.stats.find params[:id]
    if stat and stat.destroy
      ok
    else
      missing
    end
  end
end
