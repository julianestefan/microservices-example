import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError } from '@gearthlogic/common';

import { createTicketRouter } from '../routes/createTicket';
import { getTicketRouter } from '../routes/getTicket';
import { getTicketsRouter } from '../routes/getTickets';
import { updateTicketRouter } from '../routes/updateTickets';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
    secure: process.env.NODE_ENV !== 'test',
    signed: false
}))

app.use(createTicketRouter);
app.use(getTicketRouter);
app.use(getTicketsRouter);
app.use(updateTicketRouter);

app.all('*', async (req, res) => {
    throw new NotFoundError();
});

app.use(errorHandler);


export { app };