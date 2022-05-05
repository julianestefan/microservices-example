import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError } from '@gearthlogic/common';

import {cancelOrderRouter } from '../routes/cancelOrder';
import {getOrderRouter } from '../routes/getOrder';
import {getOrdersRouter } from '../routes/getOrders';
import {createOrderRouter } from '../routes/createOrder';


const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
    secure: process.env.NODE_ENV !== 'test',
    signed: false
}))

app.use(createOrderRouter);
app.use(getOrderRouter);
app.use(getOrdersRouter);
app.use(cancelOrderRouter);

app.all('*', async (req, res) => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app };