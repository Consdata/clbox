import {userProfile} from '../slack/fetch-user-profile';
import {sendSlackMessage} from '../slack/send-slack-message';

export const notificationAfterFeedbackFactory = (
  functions: import('firebase-functions').FunctionBuilder,
  config: import('firebase-functions').config.Config
) => functions.firestore.document('team/{team}/inbox/{chapterLeader}/message/{messageId}').onCreate(
  async (change, context) => {
    const message = change.data();
    const slackUser = await userProfile(context.params.chapterLeader, config.slack.bottoken);
    await sendSlackMessage(config.slack.bottoken, {
      channel: `@${slackUser.name}`,
      text: `You have new feedback!`,
      attachments: [
        {
          color: `#36a64f`,
          author_name: message.fromName,
          title: `Feedback for ${message.forName}`,
          text: message.message,
          title_link: config.webapp.url,
          fallback: `${message.forName}: ${message.message}\nby ${message.fromName}`
        }
      ]
    });
  }
)
