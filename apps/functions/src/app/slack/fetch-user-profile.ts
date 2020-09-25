import * as nodeFetch from 'node-fetch';

export async function userProfile(email: string, bottoken: unknown) {
  const slackResponse = await nodeFetch(
    `https://slack.com/api/users.lookupByEmail?email=${email}`,
    {
      headers: {
        Authorization: `Bearer ${bottoken}`,
        'Content-type': 'application/json'
      },
    }
  );
  const result = await slackResponse.json();
  return result.user;
}
