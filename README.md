Moved to: https://github.com/Consdata/clbox

### Setting up slack signing secret and bot token

```
$ firebase functions:config:set slack.signingsecret="SIGNING_SECRET"
$ firebase functions:config:set slack.bottoken="BOT_OAUTH_TOKEN"
```

### Setting up webapp url for slack notifications

```
$ firebase functions:config:set webapp.url="WEBAPP_URL"
```
