import * as firebaseTools from 'firebase-tools';
import {syncDocument} from "./sync-document";

export async function syncCollection<T>(run: boolean, limitScope: string, scope: string, collection, items: T[], idPick: (item: T) => string, compareIgnore = []) {
    await Promise.all(
        items
            .filter(item => limitScope ? limitScope.split(',').includes(idPick(item)) : true)
            .map(async (item: T) => await syncDocument(
                run,
                scope,
                collection,
                idPick(item),
                item,
                compareIgnore
            ))
    );
    const dbItems = await collection.listDocuments();
    await Promise.all(
        dbItems.filter(dbItem => !items.find(item => idPick(item) === dbItem.id))
            .map(async dbItem => {
                const dbItemSubcollection = await dbItem.listCollections();
                console.log(` - remove ${scope}: ${dbItem.id}`);
                console.log(`   remove collections: ${dbItemSubcollection.map(collection => collection.path)}`);
                if (run) {
                    await Promise.all(
                        dbItemSubcollection.map(collection => firebaseTools.firestore.delete(collection.path, {recursive: true}))
                    );
                    await dbItem.delete();
                }
            })
    );
}
