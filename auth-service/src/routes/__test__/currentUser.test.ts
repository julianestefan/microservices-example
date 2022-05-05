import request from 'supertest';
import { app } from '../../core/App';

it('responds with current user details', async () => {
    const cookie = await global.signin();

    const response = await request(app)
        .get('/api/users/currentuser')
        .set('Cookie', cookie)
        .send()
        .expect(200)

    expect(response.body).toHaveProperty('email');
    expect(response.body).toHaveProperty('id');
});

it('responds with null', async () => {
    const response = await request(app)
        .get('/api/users/currentuser')
        .send()
        .expect(200)
    console.log(response.body)

    expect(Object.keys(response.body)).toHaveLength(0);
});