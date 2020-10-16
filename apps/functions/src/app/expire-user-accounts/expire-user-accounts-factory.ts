export const expireUserAccountsFactory = (
  functions: import('firebase-functions').FunctionBuilder,
  firebase: typeof import('firebase-admin')
) => {
  const firestore = firebase.firestore();
  const fetchTeams = async () => {
    const teams = await firestore.collection(`team`).get();
    return teams.docs.map(doc => doc.id);
  };
  const expiringUsers = async (team: string) => {
    return await firestore.collection(`team/${team}/user`)
      .where('withExpire', '==', true)
      .get();
  }

  function isActive(user) {
    const expire = user.expireDate;
    if (!expire) {
      return true;
    }
    return new Date().getTime() < new Date(expire).getTime();
  }

  return functions.pubsub.schedule('0 3 * * 1-7')
    .timeZone('Europe/Warsaw')
    .onRun(async ctx => {
      const teams = await fetchTeams();
      await Promise.all(teams.map(async team => {
        const users = await expiringUsers(team);
        await Promise.all(users.docs
          .filter(user => !isActive(user.data()))
          .map(async user => {
            console.log(`User to disable: ${user.id} with expire date ${user.data().expireDate}`);

            const authUser = await firebase.auth().getUserByEmail(user.id);
            await firebase.auth().updateUser(authUser.uid, {
              disabled: true
            });

            const userDoc = firestore.collection(`team/${team}/user/`).doc(user.id);
            await firestore.runTransaction(async trn => {
              const existingUserDoc = await trn.get(userDoc);
              trn
                .delete(userDoc)
                .create(
                  firestore.collection(`team/${team}/removed-users/`).doc(existingUserDoc.id),
                  existingUserDoc.data()
                );
            });
          })
        );
      }));
      return null;
    })
};
