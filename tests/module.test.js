import request from 'supertest';
import app from '../src/app.js';
import jwt from 'jsonwebtoken';

describe('Module API', () => {
    it('should return 401 when listing modules without authentication', async () => {
        const response = await request(app)
            .get('/api/modules');

        expect(response.status).toBe(401);
    });

    it('should return 401 when creating a module without authentication', async () => {
        const response = await request(app)
            .post('/api/modules/507f1f77bcf86cd799439011')
            .send({
                title: 'Introduction to Node.js',
                description: 'Learn the basics of Node.js',
                order: 1,
                duration: 30,
            });

        expect(response.status).toBe(401);
    });

    it('should return 401 before validating invalid module data when unauthenticated', async () => {
        const response = await request(app)
            .post('/api/modules/507f1f77bcf86cd799439011')
            .send({
                title: 'AB',
                description: 'Short',
                order: 0,
                duration: 0,
            });

        expect(response.status).toBe(401);
    });

    it('should return 401 when listing course modules without authentication', async () => {
        const response = await request(app)
            .get('/api/modules/507f1f77bcf86cd799439011/modules');

        expect(response.status).toBe(401);
    });

    it('should return 401 when updating a module without authentication', async () => {
        const response = await request(app)
            .put('/api/modules/507f1f77bcf86cd799439011/507f1f77bcf86cd799439012')
            .send({
                title: 'Updated Node.js Module',
            });

        expect(response.status).toBe(401);
    });
    it('should return 403 when a learner tries to create a module', async () => {
        const token = jwt.sign(
            {
                id: '507f1f77bcf86cd799439013',
                role: 'learner',
            },
            process.env.JWT_SECRET
        );

        const response = await request(app)
            .post('/api/modules/507f1f77bcf86cd799439011')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Introduction to Node.js',
                description: 'Learn the basics of Node.js',
                order: 1,
                duration: 30,
            });

        expect(response.status).toBe(403);
    });
});