class StatsController < BaseController

  requires_user

  get "/" do
    ok current_user.statistics
  end

  get "/:id/historic/:date" do
    statistic = current_user.statistics.find params[:id]
    if statistic
      date = Time.at(params[:date].to_i).utc.end_of_day
      data = { action: statistic.action }
      data[:values] = (1..7).reduce([]) do |values|
        values << {
          value: statistic.value(date),
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
    statistic = current_user.statistics.build params
    if statistic.save
      created statistic
    else
      errored statistic
    end
  end

  put "/:id" do
    debugger
    statistic = current_user.statistics.find params[:id]
    statistic.update_attributes params
    if statistic.save
      ok statistic
    else
      missing
    end
  end

  get "/:id" do
    statistic = current_user.statistics.find params[:id]
    if statistic
      ok statistic
    else
      missing
    end
  end

  delete "/:id" do
    statistic = current_user.statistics.find params[:id]
    if statistic and statistic.destroy
      ok
    else
      missing
    end
  end
end
