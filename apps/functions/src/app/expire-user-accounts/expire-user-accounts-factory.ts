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

    async function tryGetUserByEmail(email: string) {
        try {
            return await firebase.auth().getUserByEmail(email);
        } catch {
            return null;
        }
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
                        const authUser = await tryGetUserByEmail(user.id);
                        if (authUser) {
                            console.log(`User to disable: ${user.id} with expire date ${user.data().expireDate}`);
                            console.log(authUser);

                            await firebase.auth().updateUser(authUser.uid, {
                                disabled: true
                            });

                            const userDoc = firestore.collection(`team/${team}/user/`).doc(user.id);
                            console.log(userDoc);
                            await firestore.runTransaction(async trn => {
                                const existingUserDoc = await trn.get(userDoc);
                                trn
                                    .delete(userDoc)
                                    .create(
                                        firestore.collection(`team/${team}/removed-users/`).doc(existingUserDoc.id),
                                        existingUserDoc.data()
                                    );
                            });
                        }
                    })
                );
            }));
            return null;
        })
};
