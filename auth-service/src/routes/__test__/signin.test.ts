import request from 'supertest';
import { app } from '../../core/App';

it('fails when a email that does not exist is supplied', async () => {
    await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(400)
});

it('fails when a user provides invalid credentials', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201)

    const response = await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: 'passdsadsadasword'
        })
        .expect(400)
});

it('returns a jwt in a cookie when provides right credentials', async () => {
    const body = {
        email: 'test@test.com',
        password: 'password'
    };

    await request(app)
        .post('/api/users/signup')
        .send(body)
        .expect(201)

    const response = await request(app)
        .post('/api/users/signin')
        .send(body)
        .expect(200)

    expect(response.get("Set-Cookie")).toBeDefined();
});

