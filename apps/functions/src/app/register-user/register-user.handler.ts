import {RegisterUserRequest} from './register-user.request';

const emailRegex = /^[a-zA-Z0-9._-]+@(?<domain>[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4})$/i;

export const registerUserFactory = (functions: import('firebase-functions').FunctionBuilder, firebase: typeof import('firebase-admin')) =>
    functions.https.onRequest(async (request, response) => {
        console.info(`Request for user registration (${JSON.stringify(request.body)})`);

        if (request.method !== 'POST') {
            return response.status(405).send('Invalid request method (only POST allowed)');
        }

        const registerRequest = request.body as RegisterUserRequest;
        const emailMatch = registerRequest?.email?.match(emailRegex);
        const emailDomain = emailMatch[1];
        console.debug(`Registering user for email domain: ${emailDomain}`);

        const invitations = firebase.firestore().collection('invitation');
        const invitation = await invitations.where(`domain."${emailDomain}"`, '==', true).get();

        if (invitation.empty) {
            return response.contentType('json')
                .status(400)
                .send({status: 'bad'});
        } else {
            console.log(invitation.docs);
            return response.contentType('json')
                .status(200)
                .send({status: 'ok'})
        }
    });