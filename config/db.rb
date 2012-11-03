if ENV['MONGOHQ_URL']
  db_name = URI.parse(ENV['MONGOHQ_URL']).path.gsub(/^\//, '')
  conn = Mongo::Connection.from_uri(ENV['MONGOHQ_URL'])
else
  db_name = 'breadcrumbs'
  conn = Mongo::Connection.new
end

MongoMapper.connection = conn
MongoMapper.database = db_name
