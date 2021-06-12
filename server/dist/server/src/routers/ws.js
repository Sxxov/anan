import { ConnectionTopicWSResponse, ConnectionUnauthorizedErrorWSResponse } from '../../../common/src/resources/responses/ws/connection.ws.response.js';
import express from 'express';
import { Ctx } from '../core/ctx.js';
import { PingItem } from '../../../common/src/core/items/ping.item.js';
import { AccountDB } from '../core/db/account.db.js';
import { MessageMalformedWSResponse } from '../../../common/src/resources/responses/ws/message.ws.response.js';
import { WalkUtility } from '../../../common/src/resources/utilities.js';
import { Distresser } from '../core/distresser.js';
import { DistressSignalEmitSuccessWSResponse, DistressSignalListWSResponse } from '../../../common/src/resources/responses/ws/distress.ws.response.js';
import { DistressItem } from '../../../common/src/core/items/distress.item.js';
import { TopicItemFactory } from '../../../common/src/core/items/topic.item.js';
const router = express.Router();
router.ws('/echo', (ws) => {
    ws.on('message', (msg) => {
        ws.send(msg);
    });
});
router.ws('/connect', async (ws, req) => {
    const { token, } = req.query;
    let distressItem = null;
    const distressNotifiedConnections = [];
    let distressTimeoutHandle = null;
    if (typeof token !== 'string'
        || !(await AccountDB.authenticate(token))) {
        // ) {
        ws.send(String(new ConnectionUnauthorizedErrorWSResponse()));
        ws.close();
        return;
    }
    const connectionIndex = Ctx.connections.push(PingItem.from({ token })) - 1;
    const connectionItem = Ctx.connections.getAt(connectionIndex);
    const topic = new TopicItemFactory().create();
    Ctx.topics.set(connectionItem, topic);
    Ctx.clients.set(connectionItem, ws);
    Ctx.signals.set(connectionItem, []);
    ws.send(String(new ConnectionTopicWSResponse(topic)));
    ws.on('message', (message) => {
        let messageConnectionItem;
        try {
            if (typeof message !== 'string') {
                throw new Error();
            }
            messageConnectionItem = PingItem.from({
                ...JSON.parse(message),
                token: String(token),
            });
        }
        catch (_) {
            console.error(_);
            ws.send(String(new MessageMalformedWSResponse()));
            ws.close();
            return;
        }
        // if distress status changed from true to false, return true
        const isNoLongerDistressed = (messageConnectionItem.isInDistress === false
            && connectionItem.isInDistress === true);
        WalkUtility.mirror(messageConnectionItem, connectionItem);
        if (isNoLongerDistressed
            && distressItem != null) {
            // Ctx.signals.forEach((distressItems) => {
            // 	distressItems.splice(distressItems.indexOf(distressItem!), 1);
            // });
            // const signals = Ctx.signals.get(connectionItem) ?? [];
            // signals.splice(signals.indexOf(distressItem), 1);
            clearDistressNotifiedConnections();
        }
        if (connectionItem.isInDistress) {
            const connectionsToNotify = new Distresser(Ctx.connections).connectionsAround(connectionItem);
            distressItem = DistressItem.from({
                location: connectionItem.location,
                topic: Ctx.topics.get(connectionItem),
            });
            connectionsToNotify.forEach((connectionToNotify) => {
                if (connectionToNotify === connectionItem) {
                    return;
                }
                // update local active distress signals
                const signals = Ctx.signals.get(connectionToNotify);
                signals.push(distressItem);
                // emit to peers
                emitDistressSignalList(connectionToNotify, signals);
                distressNotifiedConnections.push(connectionToNotify);
            });
            distressTimeoutHandle = setTimeout(clearDistressNotifiedConnections, 30000);
            ws.send(String(new DistressSignalEmitSuccessWSResponse(distressNotifiedConnections.length)));
        }
    });
    ws.on('close', () => {
        Ctx.connections.removeAt(connectionIndex);
        Ctx.clients.delete(connectionItem);
    });
    function clearDistressNotifiedConnections() {
        clearTimeout(distressTimeoutHandle);
        Ctx.signals.forEach((distressItems) => {
            distressItems.splice(distressItems.indexOf(distressItem), 1);
        });
        const signals = Ctx.signals.get(connectionItem);
        distressNotifiedConnections.forEach((connection) => {
            emitDistressSignalList(connection, signals);
        });
        distressNotifiedConnections.length = 0;
    }
    function emitDistressSignalList(targetConnection, signals) {
        signals ?? (signals = Ctx.signals.get(connectionItem) ?? []);
        Ctx.clients.get(targetConnection)?.send(String(new DistressSignalListWSResponse(signals)));
    }
});
export const getWSRouter = () => router;
