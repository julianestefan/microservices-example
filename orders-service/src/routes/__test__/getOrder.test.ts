import request from 'supertest';

import { app } from '../../core/App';
import { Ticket } from '../../Models/Ticket';

it('returns the order if the user owns it', async () => {
    const ticket = Ticket.build({
        title: 'Ticket 2',
        price: 20
    });

    await ticket.save();
    const cookie = signin();

    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', cookie)
        .send({ ticketId: ticket.id })
        .expect(201);

    const { body: fetchOrder } = await request(app)
        .get('/api/orders/' + order.id)
        .set('Cookie', cookie)
        .send()
        .expect(200);

    expect(fetchOrder.id).toEqual(order.id);
});

it('returns an error if the user tries to fetch another user order', async () => {
    const ticket = Ticket.build({
        title: 'Ticket 2',
        price: 20
    });

    await ticket.save();
    const cookie = signin();
    const cookieTwo = signin();

    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', cookie)
        .send({ ticketId: ticket.id })
        .expect(201);

    await request(app)
        .get('/api/orders/' + order.id)
        .set('Cookie', cookieTwo)
        .send()
        .expect(404);
});
