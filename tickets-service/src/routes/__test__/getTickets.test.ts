import request from 'supertest';

import { app } from '../../core/App';
import { Ticket } from '../../Models/Ticket';

it('fetchs a list of tickets', async () => {
    const data = [
        { title: 'blabla', price: 10, userId: 'blabla' },
        { title: 'blabla', price: 10, userId: 'blabla' }
    ]

    data.forEach(async ticketData => {
        const ticket = Ticket.build(ticketData);
        await ticket.save();
    })

    const response = await request(app)
        .get('/api/tickets')
        .send()
        .expect(200);

    expect(response.body.length).toEqual(data.length);
})