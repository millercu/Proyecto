import { MongoClient, ObjectId } from 'mongodb';
let mongoDb = null;

export function initPool() {
    return new Promise((resolve, reject) => {
        const url ="mongodb://127.0.0.1:27017";
        MongoClient.connect(url, {
            minPoolSize: 2
        }, function (err, db) {
            if (!err) {
                mongoDb = db;
                resolve({});                
                return;
            }
            reject(err);
        }
        );
    });

}
export function getConnection(){
    return mongoDb.db("inventario");
}

export function getObjectId(id){
    return new ObjectId(id);
}
export async function find(collectionName, criteria,) {
    const db = mongoDb.db("inventario");    
    const collection = db.collection(collectionName);
    return collection.find(criteria);
}

export async function save(collectionName, document) {
    const collection = mongoDb.collection(collectionName);
    return collection.save(document);
}

