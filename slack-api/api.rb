require 'sinatra'
require 'json'

post '/' do
  content_type :json

  if params[:token] != 'yFbsHnLCEHuYnfkTp8a9wTWf'
    return [401, { error: 'Unauthorized' }.to_json]
  end

  {
    response_type: 'in_channel',
    text: "Hi #{params[:user_id]}!\n"\
          "You asked me to do \"#{params[:command]} #{params[:text]}\"...\n"\
          "Which I will do... eventually!"
  }.to_json
end
