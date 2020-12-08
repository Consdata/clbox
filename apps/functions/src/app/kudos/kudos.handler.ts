import {checkSlackSignature} from '../slack/check-slack-signature';
import {PendingFeedbackMessage} from '../pending-feedback-message';
import {SlashCommandRequest} from '../slack/slash-command-request';

export const kudosHandlerFactory = (
    functions: import('firebase-functions').FunctionBuilder,
    config: import('firebase-functions').config.Config,
    pubsub: import('@google-cloud/pubsub').PubSub,
    userFeedbackTopic: string,
    channelFeedbackTopic: string) =>
    functions.https.onRequest(async (request, response) => {
        if (request.method !== 'POST') {
            response.status(405).send('Invalid request method (only POST allowed)');
        }
        if (!checkSlackSignature(
            config.slack.signingsecret,
            request.headers['x-slack-signature'] as string,
            request.headers['x-slack-request-timestamp'],
            request.rawBody.toString()
        )) {
            console.log('Invalid slack signing');
            response.status(401).send('Invalid slack signing');
            return;
        }

        const slashCommand: SlashCommandRequest = request.body;

        const userMention = slashCommand.text.match(/@[^\s]+/);
        const channelMention = slashCommand.text.match(/#[^\s]+/);
        if (userMention && userMention.length === 1) {
          const mention = userMention[0].substr(1);
          const feedback = slashCommand.text.substr(mention.length + 2);

          await pubsub.topic(userFeedbackTopic).publish(Buffer.from(JSON.stringify(<PendingFeedbackMessage>{
            mention, feedback, user: slashCommand.user_name, team: slashCommand.team_domain
          })));

          response.contentType('json')
            .status(200)
            .send({
              'response_type': 'ephemeral',
              'text': `Thank you for your feedback!`
            });
        } else if (channelMention && channelMention.length === 1) {
          const mention = channelMention[0].substr(1);
          const feedback = slashCommand.text.substr(mention.length + 2);

          console.log(`Channel feedback for ${mention}: ${feedback}`);

          await pubsub.topic(channelFeedbackTopic).publish(Buffer.from(JSON.stringify(<PendingFeedbackMessage>{
            mention, feedback, user: slashCommand.user_name, team: slashCommand.team_domain
          })));

          response.contentType('json')
            .status(200)
            .send({
              'response_type': 'ephemeral',
              'text': `Thank you for your feedback!`
            });
        } else {
            response.contentType('json')
                .status(200)
                .send({
                    'response_type': 'ephemeral',
                    'text': `Please use /kudos @mention/#mention rest of the feedback`
                });
        }
    });
