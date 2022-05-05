import request from 'supertest';
import { app } from '../../core/App';
import { Ticket } from '../../Models/Ticket';
import { eventBusClient } from '../../events/EventBusClient';

it('has a route handler listening to /api/tickets for post requests', async () => {
    const response = await request(app)
        .post('/api/tickets')
        .send();

    expect(response.status).not.toEqual(404);
});

it('can only be accessed if user is signed in', async () => {
    await request(app)
        .post('/api/tickets')
        .send()
        .expect(401)
});

it('return other status than 401 if already authenticated', async () => {
    const cookie = signin();

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send()

    expect(response.status).not.toEqual(401);
});

it('returns an error if an invalid title is provided', async () => {
    const cookie = signin();

    await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: '',
            price: 10
        })
        .expect(400)

    await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            price: 10
        })
        .expect(400)
});

it('returns an error if an invalid price is provided', async () => {
    const cookie = signin();

    await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'blabla',
            price: -10
        })
        .expect(400)

    await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: '10'
        })
        .expect(400)
});

it('creates a ticket in the database', async () => {
    let tickets = await Ticket.find();
    expect(tickets.length).toEqual(0)
    const cookie = signin();

    await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'blabla',
            price: 10
        })
        .expect(201)

    tickets = await Ticket.find();
    expect(tickets.length).toEqual(1)
});

it('publishes an event', async () => {
    const cookie = signin();

    await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'blabla',
            price: 10
        })
        .expect(201)

    expect(eventBusClient.client.publish).toHaveBeenCalled();
});