import * as nodeFetch from 'node-fetch';

export async function sendSlackMessage(bottoken: string, message: unknown) {
  return nodeFetch(`https://slack.com/api/chat.postMessage`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${bottoken}`,
      'Content-type': 'application/json'
    },
    body: JSON.stringify(message)
  });
}
