import {userProfile} from "../slack/fetch-user-profile";
import {sendSlackMessage} from "../slack/send-slack-message";
import {SlackUser} from "../slack/slack-user";

export const notifyAfterChannelFeedbackFactory = (
  functions: import('firebase-functions').FunctionBuilder,
  config: import('firebase-functions').config.Config,
  firebase: typeof import('firebase-admin')
) => functions.firestore.document('team/{team}/channel/{channel}/inbox/{messageId}').onCreate(
  async (change, context) => {
    console.log(`Notify managers after channel feedback (channel=${context.params.channel})`)
    const message = change.data();
    const channel = await firebase.firestore()
      .collection(`team/${context.params.team}/channel/`)
      .doc(context.params.channel)
      .get();
    const managers = await Promise.all<SlackUser>(
      channel.data().managers.map(manager => userProfile(manager, config.slack.bottoken))
    );
    console.log(`Sending slack notification to managers: [${managers.map(slackUser => slackUser.name)}]`);
    await Promise.all(managers.map(slackUser => sendSlackMessage(
      config.slack.bottoken,
      {
        channel: `@${slackUser.name}`,
        text: `You have new channel feedback for: ${channel.data().short_name}!`,
        attachments: [
          {
            color: `#36a64f`,
            author_name: message.fromName,
            text: message.message,
            title_link: config.webapp.url,
            fallback: `${message.forName}: ${message.message}\nby ${message.fromName}`
          }
        ]
      }
    )));
  }
)
