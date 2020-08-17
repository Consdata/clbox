export const awakeHandlerFactory = (functions: import('firebase-functions').FunctionBuilder) =>
    functions.https.onRequest((request, response) => {
        response.status(200).send({status: 'ok'});
    });