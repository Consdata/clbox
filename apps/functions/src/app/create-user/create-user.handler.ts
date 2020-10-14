import {CreateUserRequest} from './create-user.request';

const emailRegex = /^[a-zA-Z0-9._-]+@(?<domain>[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4})$/i;

export const createUserFactory = (
  functions: import('firebase-functions').FunctionBuilder,
  firebase: typeof import('firebase-admin')
) => {
  async function tryToFindUserByEmail(email: string) {
    try {
      return await firebase.auth().getUserByEmail(email);
    } catch {
      return undefined;
    }
  }

  return functions.https.onCall(async (data, context) => { // S5
    console.info(`Request for user registration (${JSON.stringify(data)})`);

    const registerRequest = data as CreateUserRequest;
    const emailMatch = registerRequest?.email?.match(emailRegex);
    const emailDomain = emailMatch[1];

    const invitations = firebase.firestore().collection('invitation');
    const invitation = await invitations.where( // S6
      new firebase.firestore.FieldPath('domain', emailDomain),
      '==',
      true
    ).get();

    if (invitation.empty) {
      console.warn(`Invitation not found for domain: ${emailDomain}`);
      return {
        status: 'bad'
      };
    } else {
      const existingUser = await tryToFindUserByEmail(registerRequest.email); // S7
      if (!existingUser) {
        console.info(`User created for email: ${registerRequest.email}`);
        await firebase.auth().createUser({ // S8
          email: registerRequest.email,
          emailVerified: false
        });
        await firebase.firestore().collection('user').doc(registerRequest.email).set({ // S9
          teams: {
            [invitation.docs[0].id]: true
          }
        })
      } else {
        console.info(`User already exists (${registerRequest.email})`);
      }
      return {
        status: 'ok'
      };
    }
  });
};
