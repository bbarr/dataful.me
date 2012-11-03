class EntriesController < BaseController

  requires_user

  get "/" do
    ok current_user.entries
  end

  post "/" do
    entry = current_user.entries.build params
    if entry.save
      created entry
    else
      errored entry
    end
  end

  delete "/:id" do
    entry = current_user.entries.find params[:id]
    if entry and entry.destroy
      ok
    else
      missing
    end
  end

end
