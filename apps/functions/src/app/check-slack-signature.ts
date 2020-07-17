import * as crypto from 'crypto';
import * as tsscmp from 'tsscmp';

export const checkSlackSignature = (slackSigningSecret, signature, timestamp, rawBody) => {
    const [requestSigningVersion] = signature.split('=');

    const hmac = crypto.createHmac('sha256', slackSigningSecret);
    let data = `${requestSigningVersion}:${timestamp}:${rawBody}`;
    hmac.update(data);
    const verifyDigest = `${requestSigningVersion}=${hmac.digest('hex')}`;

    return tsscmp(signature, verifyDigest);
};