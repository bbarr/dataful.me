class StatsController < BaseController

  requires_user

  get "/" do
    ok current_user.stats
  end

  get "/:id/historic/:date" do
    stat = current_user.stats.find params[:id]
    if stat
      date = Time.at(params[:date].to_i).utc.end_of_day
      data = { action: stat.action }
      data[:values] = (1..7).reduce([]) do |values|
        values << {
          value: stat.value(date),
          date: date
        }
        date = date.yesterday
        values
      end
      if data[:values].find { |v| v[:value] != '' }
        ok data
      else
        missing
      end
    else
      missing
    end
  end

  post "/" do
    stat = current_user.stats.build params
    if stat.save
      created stat
    else
      errored stat
    end
  end

  put "/:id" do
    stat = current_user.stats.find params[:id]
    stat.update_attributes params
    if stat.save
      ok stat
    else
      missing
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
