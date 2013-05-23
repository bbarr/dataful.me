class EntriesController < BaseController

  requires_user

  get "/" do
    ok current_user.entries.sort(:created_at.desc).limit(10)
  end

  post "/" do
    entry = current_user.entries.build params
    if entry.save
      created entry
    else
      errored entry
    end
  end

  put "/:id" do
    entry = current_user.entries.find(params[:id])
    entry.update_attributes params
    if entry.save
      ok
    else
      missing
    end
  end

  delete "/:id" do
    entry = current_user.entries.find(params[:id])
    if entry and entry.destroy
      ok
    else
      missing
    end
  end

end
