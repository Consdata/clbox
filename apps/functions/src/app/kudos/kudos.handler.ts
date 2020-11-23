import {checkSlackSignature} from '../slack/check-slack-signature';
import {PendingKudosMessage} from '../pending-kudos-message';
import {SlashCommandRequest} from '../slack/slash-command-request';

export const kudosHandlerFactory = (
    functions: import('firebase-functions').FunctionBuilder,
    config: import('firebase-functions').config.Config,
    pubsub: import('@google-cloud/pubsub').PubSub) =>
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
            console.error('Invalid slack signing');
            response.status(401).send('Invalid slack signing');
            return;
        }

        const slashCommand: SlashCommandRequest = request.body;

        const userMention = slashCommand.text.match(/@[^\s]+/);
        const channelMention = slashCommand.text.match(/#[^\s]+/);
        if (userMention && userMention.length === 1) {
          const mention = userMention[0].substr(1);
          const feedback = slashCommand.text.substr(mention.length + 2);

          await pubsub.topic('pending-slack-notifications').publish(Buffer.from(JSON.stringify(<PendingKudosMessage>{
            mention, feedback, user: slashCommand.user_name, team: slashCommand.team_domain
          })));

          response.contentType('json')
            .status(200)
            .send({
              'response_type': 'ephemeral',
              'text': `Thank you for your feedback!`
            });
        } else if (channelMention && channelMention.length === 1) {
          response.contentType('json')
            .status(200)
            .send({
              'response_type': 'ephemeral',
              'text': `Channel mentions not fully implemented yet`
            });
        } else {
            response.contentType('json')
                .status(200)
                .send({
                    'response_type': 'ephemeral',
                    'text': `Please use /kudos @mention rest of the feedback`
                });
        }
    });
