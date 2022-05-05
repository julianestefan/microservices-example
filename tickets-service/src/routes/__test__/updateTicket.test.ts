import request from 'supertest';
import mongoose from 'mongoose';

import { app } from '../../core/App';
import { eventBusClient } from '../../events/EventBusClient';

it('returns a 404 if the provided id does not exist', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    const cookie = signin();
    const body = {
        title: 'bla',
        price: 10
    }

    const response = await request(app)
        .put('/api/tickets/' + id)
        .set('Cookie', cookie)
        .send(body)
        .expect(404);

});

it('returns a 401 if user is not authenticated', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    const body = {
        title: 'bla',
        price: 10
    }

    await request(app)
        .put('/api/tickets/' + id)
        .send(body)
        .expect(401);
});

it('return a 401 if the user does not own the ticket', async () => {
    const body = {
        title: 'bla',
        price: 10
    }

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', signin())
        .send(body)

    await request(app)
        .put('/api/tickets/' + response.body.id)
        .set('Cookie', signin())
        .send({
            title: 'blaaaaaa',
            price: 15
        })
        .expect(401);
});


it('returns a 400 if an invalid title or price are provided', async () => {
    const cookie = signin();

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'babla',
            price: 10
        })

    await request(app)
        .put('/api/tickets/' + response.body.id)
        .set('Cookie', cookie)
        .send({
            title: '',
            price: 10
        })
        .expect(400)

    await request(app)
        .put('/api/tickets/' + response.body.id)
        .set('Cookie', cookie)
        .send({
            title: 'b',
            price: -10
        })
        .expect(400)
});


it('updates a ticket in the database', async () => {
    const cookie = signin();

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'babla',
            price: 10
        });

    const updateBody = {
        title: 'b',
        price: 10
    };

    await request(app)
        .put('/api/tickets/' + response.body.id)
        .set('Cookie', cookie)
        .send(updateBody)
        .expect(200)

    const fetchResponse = await request(app)
        .get('/api/tickets/' + response.body.id)
        .send()

    expect(fetchResponse.body.title).toEqual(updateBody.title);
    expect(fetchResponse.body.price).toEqual(updateBody.price);
});

it('publishes an event', async () => {
    const cookie = signin();

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'babla',
            price: 10
        });

    const updateBody = {
        title: 'b',
        price: 10
    };

    await request(app)
        .put('/api/tickets/' + response.body.id)
        .set('Cookie', cookie)
        .send(updateBody)
        .expect(200)

    expect(eventBusClient.client.publish).toHaveBeenCalled();
});