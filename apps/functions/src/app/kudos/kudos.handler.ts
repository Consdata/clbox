import {checkSlackSignature} from '../slack/check-slack-signature';
import {PendingKudosMessage} from '../pending-kudos-message';
import {SlashCommandRequest} from '../slack/slash-command-request';

export const kudosHandlerFactory = (
    functions: import('firebase-functions').FunctionBuilder,
    config: import('firebase-functions').config.Config,
    pubsub: import('@google-cloud/pubsub').PubSub) =>
    functions.https.onRequest(async (request, response) => {
        if (request.method !== 'POST') {
            return response.status(405).send('Invalid request method (only POST allowed)');
        }
        if (!checkSlackSignature(
            config.slack.signingsecret,
            request.headers['x-slack-signature'] as string,
            request.headers['x-slack-request-timestamp'],
            request.rawBody.toString()
        )) {
            return response.status(401).send('Invalid slack signing');
        }

        const slashCommand: SlashCommandRequest = request.body;
        const mentions = slashCommand.text.match(/@[^\s]+/);
        if (mentions && mentions.length === 1) {
            const mention = mentions[0].substr(1);
            const feedback = slashCommand.text.substr(mention.length + 2);

            await pubsub.topic('pending-slack-notifications').publish(Buffer.from(JSON.stringify(<PendingKudosMessage>{
                mention, feedback, user: slashCommand.user_name, team: slashCommand.team_domain
            })));

            return response.contentType('json')
                .status(200)
                .send({
                    'response_type': 'ephemeral',
                    'text': `Thank you for your feedback!`
                });
        } else {
            return response.contentType('json')
                .status(200)
                .send({
                    'response_type': 'ephemeral',
                    'text': `Please use /kudos @mention rest of the feedback`
                });
        }
    });
