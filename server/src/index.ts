import express from 'express';
import expressWS from 'express-ws';
const { app } = expressWS(express());
import { RouterWS } from './routers/ws.js';
import dotEnv from 'dotenv';
import { Ctx } from './core/ctx.js';
import { StoreArray } from '../../common/src/core/blocks/store/extended/array.js';
import { RouterImage } from './routers/image.js';

dotEnv.config();

Ctx.connections = new StoreArray();
Ctx.clients = new Map();
Ctx.topics = new Map();
Ctx.signals = new Map();

export const enum Constants {
	PORT = 6969,
	DISTRESS_RADIUS_DEG = 0.000001,
}

app.get('/api/v1', (req, res) => {
	res.redirect('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
});

app.use('/api/v1/ws', RouterWS);

app.use('/api/v1/image', RouterImage);

app.listen(Constants.PORT);
