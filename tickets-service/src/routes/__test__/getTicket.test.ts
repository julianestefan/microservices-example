import request from 'supertest';
import mongoose from 'mongoose'

import { app } from '../../core/App';
import { Ticket } from '../../Models/Ticket';

it('return 404 if ticket not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .get('/api/tickets/' + id)
        .send()
        .expect(404);

});

it('return the ticket if exists', async () => {
    const data = { title: 'blabla', price: 10, userId: 'blabla' }
    const ticket = Ticket.build(data);
    const savedTicket = await ticket.save();

    const response = await request(app)
        .get('/api/tickets/' + savedTicket._id.toString())
        .send()
        .expect(200);

    expect(response.body.title).toEqual(data.title);
    expect(response.body.price).toEqual(data.price);
});