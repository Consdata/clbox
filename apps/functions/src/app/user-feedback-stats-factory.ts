export const userFeedbackStatsFactory = (
  functions: import('firebase-functions').FunctionBuilder,
  firebase: typeof import('firebase-admin')
) => functions.firestore.document('team/{team}/sent/{user}/message/{messageId}').onCreate(
  async (change, context) => {
    const firestore = firebase.firestore();

    const {date} = change.data() as { date: string };
    const day = date.substring(0, 10);
    const year = date.substring(0, 4);
    const userRef = firestore.collection(`team/${context.params.team}/user`).doc(context.params.user);

    await firestore.runTransaction(async trn => {
      const monthDoc = await trn.get(userRef);
      const statsData = monthDoc.data();
      await trn.set(userRef,
        {
          stats: {
            [year]: {
              [day]: (statsData?.byYear?.[year]?.[day] ?? 0) + 1,
              summary: (statsData?.byYear?.[year]?.summary ?? 0) + 1
            }
          }
        },
        {
          merge: true
        })
    });
  }
)

