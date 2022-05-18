'use strict';

import { server as _server } from '@hapi/hapi';
import { initPool, getConnection, getObjectId } from './mongoClient.js';

const collectionName = "inventario";


async function getInventarioById(inventarioId) {
    const db = getConnection();
    const collection = db.collection(collectionName);
    const inventarios = await collection.find({ "_id": getObjectId(inventarioId) }).toArray();
    return inventarios[0];
}

async function getInventarioById(inventarioId) {
    const db = getConnection();
    const collection = db.collection(collectionName);
    const inventarios = await collection.find({ "_id": getObjectId(inventarioId) }).toArray();
    return inventarios[0];
}

async function updateInventarioById(inventarioId, inventario) {
    try {
        const db = getConnection();
        const collection = db.collection(collectionName);
        await collection.replaceOne({ "_id": getObjectId(inventarioId) }, { ...inventario });
        return getInventarioById(inventarioId);
    } catch (err) {
        console.error(err);
        throw err;
    }

}

async function deleteInventarioById(inventarioId) {
    const db = getConnection();
    const collection = db.collection(collectionName);
    await collection.deleteOne({ "_id": getObjectId(inventarioId) });
    return {};
}

async function saveInventario(inventario) {
    const db = getConnection();
    const collection = db.collection(collectionName);
    const newInventario = await collection.insertOne(inventario);
    return getInventarioById(newInventario.insertedId.toString());
}

const init = async () => {

    const server = _server({
        port: 3000,
        host: '0.0.0.0',
        routes: {
            cors: {
                origin: ['*'],
                headers: ['accept', 'authorization', 'content-type', 'if-none-match', 'origin', 'Access-Control-Allow-Headers'],
                exposedHeaders: ['Accept'],
                additionalExposedHeaders: ['Accept'],
                maxAge: 60,
                credentials: false,
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/inventario',
        handler: async () => {
            try {
                const db = getConnection();
                const collection = db.collection(collectionName);
                const cursor = await collection.find({});
                return cursor.toArray();
            } catch (err) {
                console.err(err);
                throw err;
            }

        }
    });

    server.route({
        method: 'GET',
        path: '/inventario/{inventarioId}',
        config: {
            handler: async (req) => {
                const inventarioId = req.params.inventarioId;
                return getInventarioById(inventarioId);
            }
        }

    });

    server.route({
        method: 'POST',
        path: '/inventario',
        config: {
            handler: async (req) => {
                return saveInventario(req.payload);
            }
        }

    });

    server.route({
        method: 'PUT',
        path: '/inventario/{inventarioId}',
        config: {
            handler: async (req) => {
                const inventarioId = req.params.inventarioId;
                return updateInventarioById(inventarioId, req.payload);
            }
        }
    });

    server.route({
        method: 'DELETE',
        path: '/inventario/{inventarioId}',
        config: {
            handler: async (req) => {
                const inventarioId = req.params.inventarioId;
                return deleteInventarioById(inventarioId);
            }
        }
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});
await initPool();
init();