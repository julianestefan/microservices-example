import request from 'supertest';

import { app } from '../../core/App';
import { Ticket } from '../../Models/Ticket';

async function buildticket() {
    const ticket = Ticket.build({
        title: 'Ticket 2',
        price: 20
    });

    return ticket.save();
}

it('get current user tickets', async () => {
    const ticketOne = await buildticket();
    const ticketTwo = await buildticket();
    const ticketThree = await buildticket();
    const cookieOne = signin();
    const cookieTwo = signin();

    await request(app)
        .post('/api/orders')
        .set('Cookie', cookieOne)
        .send({ ticketId: ticketOne.id })
        .expect(201);

    const { body: orderOne } = await request(app)
        .post('/api/orders')
        .set('Cookie', cookieTwo)
        .send({ ticketId: ticketTwo.id })
        .expect(201);

    const { body: orderTwo } = await request(app)
        .post('/api/orders')
        .set('Cookie', cookieTwo)
        .send({ ticketId: ticketThree.id })
        .expect(201);

    const response = await request(app)
        .get('/api/orders')
        .set('Cookie', cookieTwo)
        .send()

    expect(response.body.length).toEqual(2);
    expect(response.body[0].id).toEqual(orderOne.id)
    expect(response.body[1].id).toEqual(orderTwo.id)
    expect(response.body[0].ticket.id).toEqual(ticketTwo.id)
    expect(response.body[1].ticket.id).toEqual(ticketThree.id)
});