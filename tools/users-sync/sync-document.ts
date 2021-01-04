import {containsWithin} from "./contains-within";
import {orderProps} from "./order-props";

export async function syncDocument(run, scope, collection, id, update, compareIgnore = []) {
    const document = collection.doc(id);
    const documentSnapshot = await document.get();
    const documentData = await documentSnapshot.data();

    if (!containsWithin(update, documentData)) {
        if (documentData || !expired(update)) {
            console.log(` - update ${scope}: ${id}\n     ${JSON.stringify(orderProps(documentData, compareIgnore))}\n  => ${JSON.stringify(orderProps(update, compareIgnore))}`);
            if (run) {
                await document.set(update, {merge: true});
            }
        } else {
            console.log(` - skipping creation of expired ${scope}: ${id}\n     ${JSON.stringify(update)}`);
        }
    }
}

function expired({expireDate}) {
    return expireDate && new Date().getTime() > new Date(expireDate).getTime();
}
