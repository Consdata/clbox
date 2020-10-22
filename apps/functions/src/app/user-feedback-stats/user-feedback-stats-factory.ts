export const userFeedbackStatsFactory = (
  functions: import('firebase-functions').FunctionBuilder,
  firebase: typeof import('firebase-admin')
) => functions.firestore.document('team/{team}/sent/{user}/message/{messageId}').onCreate(
  async (change, context) => {
    const firestore = firebase.firestore();

    const {date} = change.data() as { date: string };
    const day = date.substring(0, 10);
    const year = date.substring(0, 4);
    const statsRef = firestore
      .collection(`team/${context.params.team}/user/${context.params.user}/stats`)
      .doc('sent-feedbacks');

    await statsRef.set(
      {
        byYear: {
          [year]: {
            [day]: firebase.firestore.FieldValue.increment(1),
            summary: firebase.firestore.FieldValue.increment(1),
          }
        }
      },
      {
        merge: true
      }
    );
  }
)

