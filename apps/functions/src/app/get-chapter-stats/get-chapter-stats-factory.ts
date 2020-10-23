interface GetChapterStatsRequest {
  team: string;
  statType: string;
}

export const getChapterStatsFactory = (
  functions: import('firebase-functions').FunctionBuilder,
  firebase: typeof import('firebase-admin')
) => functions.https.onCall(async (data: GetChapterStatsRequest, context) => {
  if (!context.auth?.token?.email) {
    throw new Error(`Functions requires authentication`);
  }
  const firestore = firebase.firestore();
  const auth = context.auth?.token?.email;

  const users = await firestore
    .collection(`/team/${data.team}/user`)
    .where('chapterLeader', '==', auth)
    .get();

  return await Promise.all([
    firestore
      .collection(`/team/${data.team}/user/${auth}/stats`)
      .doc(data.statType)
      .get()
      .then(doc => ({
        user: auth,
        stats: doc.data()
      })),
    ...users.docs.map(async user => {
      const stats = await firestore
        .collection(`/team/${data.team}/user/${user.id}/stats`)
        .doc(data.statType)
        .get();
      return {
        user: user.id,
        stats: stats.data()
      };
    })
  ]);
})
