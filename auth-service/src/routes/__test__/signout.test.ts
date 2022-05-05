import request from 'supertest';
import { app } from '../../core/App';

it('clear cookie when signout', async () => {
    const body = {
        email: 'test@test.com',
        password: 'password'
    };

    await request(app)
        .post('/api/users/signup')
        .send(body)
        .expect(201)

    const response = await request(app)
        .post('/api/users/signout')
        .send({})
        .expect(200)

    expect(!response.get("Set-Cookie")).toBeDefined();
});
