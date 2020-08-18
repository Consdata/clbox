export const feedbackStatsFactory = (
  functions: import('firebase-functions').FunctionBuilder,
  firebase: typeof import('firebase-admin')
) => functions.firestore.document('team/{team}/inbox/{chapterLeader}/message/{messageId}').onCreate(
  async (change, context) => {
    const firestore = firebase.firestore();

    const {date} = change.data() as { date: string };
    const month = date.substring(0, 7);
    const day = date.substring(0, 10);
    const monthRef = firestore.collection(`team/${context.params.team}/stats`).doc(month);

    await firestore.runTransaction(async trn => {
      const monthDoc = await trn.get(monthRef);
      const statsData = monthDoc.data();
      await trn.set(monthRef, {
        [day]: (statsData?.[day] ?? 0) + 1,
        summary: (statsData?.summary ?? 0) + 1
      }, {
        merge: true
      })
    });
  }
)

