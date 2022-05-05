import request from 'supertest';
import { OrderStatus } from '@gearthlogic/common';

import { app } from '../../core/App';
import { Ticket } from '../../Models/Ticket';
import { eventBusClient } from '../../events/EventBusClient';

it('returns the order with a cancelled status', async () => {
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
        .put('/api/orders/' + order.id)
        .set('Cookie', cookie)
        .send()
        .expect(200);

    expect(fetchOrder.status).toEqual(OrderStatus.Cancelled);
});

 it('returns an error if the user tries to cancel another user order', async () => {
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
        .put('/api/orders/' + order.id)
        .set('Cookie', cookieTwo)
        .send()
        .expect(404);
});


it('returns the order with a cancelled status', async () => {
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
        .put('/api/orders/' + order.id)
        .set('Cookie', cookie)
        .send()
        .expect(200);

    expect(eventBusClient.client.publish).not.toHaveBeenCalled();
});