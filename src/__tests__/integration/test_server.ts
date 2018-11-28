const request = require('supertest');
const server = require('../../../src/server');

describe('basic route tests', () => {
    test('get home route GET /', async () => {
        const response = await request(server).get('/');

        expect(response.statusCode).toEqual(200);
        expect(response.text).toContain('Hello');
    });
});

afterAll(() => {
    server.close();
});
