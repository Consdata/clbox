import * as nodeFetch from 'node-fetch';

async function userProfile(context: import('firebase-functions').EventContext, slackHttpHeaders: unknown) {
  const slackResponse = await nodeFetch(
    `https://slack.com/api/users.lookupByEmail?email=${context.params.chapterLeader}`,
    {
      headers: slackHttpHeaders,
    }
  ).then(response => response.json());
  return slackResponse.user;
}

export const notificationAfterFeedbackFactory = (
  functions: import('firebase-functions').FunctionBuilder,
  config: import('firebase-functions').config.Config
) => functions.firestore.document('team/{team}/inbox/{chapterLeader}/message/{messageId}').onCreate(
  async (change, context) => {
    const slackHttpHeaders = {
      Authorization: `Bearer ${config.slack.bottoken}`,
      'Content-type': 'application/json'
    };
    const message = change.data();
    const slackUser = await userProfile(context, slackHttpHeaders);
    await nodeFetch(`https://slack.com/api/chat.postMessage`, {
      method: 'POST',
      headers: slackHttpHeaders,
      body: JSON.stringify({
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
      })
    });
  }
)
