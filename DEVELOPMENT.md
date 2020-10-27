# Common dev environment

1. Request persmissions to firebase project
2. Setup firebase cli and login
3. Create .local.env based on .env and firebase webapp configuration (web app config -> sdk snippet -> konfiguracja)
(opt) 4. Deploy local changes to dev via `firebase deploy`

# New/custom test environment

## Perquisitions

1. Setup firebase account
2. [Install firebase cli and login](https://firebase.google.com/docs/cli#mac-linux-npm)
3. Create firebase test/dev project

## Configure project for firebase

4. Create firebase app for web with hosting enabled
5. Create .local.env based on .env and firebase webapp configuration (web app config -> sdk snippet -> konfiguracja)

## Configure authentication for firebase project

6. Open authentication in firebase project console (Programming > Authentication)
7. Enable email authentication
8. Create test user for development on users tab

## Configure firestore

9. Open cloud firestore in firebase project console (Programming > Authentication)
10. Choose valid region (eg. europe-west-3)
11. Deploy firestore security rules `firebase deploy --only firestore`

## Configure initial database layout

12. Create collection for team
    12. Open Cloud Firestore
    12. Add collection „team”
    12. For document id use your slack workspace name and leave document fields empty
13. Create users collection with team link
    13. Open Cloud Firestore
    13. Add collection „user”
    13. For document id use your test user email (from pt. 8.)
    13. Add document field of type map named „teams” with value team_name: (boolean) true

## Create test user - chapter leader mapping

14. Create collection team/{team}/user ({team} is the name of the Slack workspace)
    14. Open Cloud Firestore
    14. For document id use matching test user email (from pt. 8.)
    14. Add document field chapterLeader as string with value of the chapter leader email

## Deploy frontend app to hosting

14. Run `firebase deploy --only hosting`

## Deploy frontend app to functions

Ensure you have enabled billing and blaze account level for firebase.

15. Configure environment variables based on README.md
    15. Configure chat bot with oauth token
        15. Create slack bot oauth token with permissions in "Bot Token Scopes" section: chat:write, commands, user.profile:read, users:read, users:read.email
        15. Install app to slack workspace bia "Install App to Workspace"
        15. Copy "Bot User OAuth Access Token"
16. Run `firebase deploy --only functions`

## Add chat cloud functions as chat bot to slack

17. Get _kudosHandler_ function HTTP url from firebase console (programming / functions)
18. Add slack slash command with _kudosHandler_ endpoint 
