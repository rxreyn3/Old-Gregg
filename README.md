![Alt text](public/images/gregg.png?raw=true "Old Gregg")

# Standup Gregg
A slack bot integration for standups.

## Install

- Clone the repo
- Run `npm install`
- Install globally:
    - nodemon `npm i nodemon -g`
    - localtunnel `npm i localtunnel -g`
- Deploy to Azure
- Manually add app to slack team https://api.slack.com/apps
    - Fill out basic information
    - Add slash command for `/gregg`
    - **TODO** Add add to slack button
    - **TODO** Explain Bot setup/event init

## Application Settings

You'll need to have the following settings, at minimum, in your local `.env` file or application settings on the cloud:

- `SLACK_TOKEN`=xoxb-32636*xxx*
- `SLACK_VERIFICATION_TOKEN`=EqisLC*xxx*
- `AZURE_STORAGE_CONNECTION_STRING`=DefaultEndpointsProtocol=https;AccountName=*xxx*

Note that you can copy the included `.env.example` to `.env` to begin with.

## Azure Git Configuration

To setup continous deployment to your azure app service, follow these instructions:

- TODO