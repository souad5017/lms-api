
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app.js';
import connectDB from '../src/config/db.js';
import User from '../src/models/User.js';

beforeAll(async () => {
    await connectDB();
});


afterAll(async () => {
    await mongoose.connection.close();
});

afterEach(async () => {
    await User.deleteMany({
        email: {
            $in: [
                'learner@test.com',
                'disabled@test.com'
            ]
        }
    });
});

describe('Authentication API', () => {
    const testUser = {
        name: 'Test Learner',
        email: 'learner@test.com',
        password: 'Password123'
    };

    test('POST /api/auth/register - should create an account', async () => {

        const response = await request(app)
            .post('/api/auth/register')
            .send(testUser);


        //   console.log(response.body);

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('User registered successfully');
        expect(response.body.user.email).toBe(testUser.email);
        expect(response.body.user.role).toBe('learner');
        expect(response.body.user.password).toBeUndefined();
    });

    test('POST /api/auth/login - should return a JWT token', async () => {
        await User.create({
            ...testUser,
            role: 'learner',
            status: 'active'
        });

        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: testUser.email,
                password: testUser.password
            });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Login successful');
        expect(response.body.token).toBeDefined();
    });

    test('POST /api/auth/login - should reject an incorrect password', async () => {
        await User.create({
            ...testUser,
            role: 'learner',
            status: 'active'
        });

        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: testUser.email,
                password: 'WrongPassword123'
            });

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Invalid password');
    });

    test('GET /api/enrollments - should reject access without a token', async () => {
        const response = await request(app)
            .get('/api/enrollments');

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Token manquant ou format invalide');
    });


    test('GET /api/enrollments - should reject an invalid token', async () => {
        const response = await request(app)
            .get('/api/enrollments')
            .set('Authorization', 'Bearer fake-token-123');

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Invalid or expired token');
    });



    test('POST /api/auth/login - should reject a disabled account', async () => {
        await User.create({
            name: 'Disabled Learner',
            email: 'disabled@test.com',
            password: 'Password123',
            role: 'learner',
            status: 'disabled'
        });

        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'disabled@test.com',
                password: 'Password123'
            });

        expect(response.status).toBe(403);
        expect(response.body.message).toBe('Account is disabled');
    });


    test('POST /api/auth/register - should reject invalid data', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'S',
                email: 'invalid-email',
                password: '123'
            });

        expect(response.status).toBe(400);
    });


    test('POST /api/auth/register - should reject missing fields', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Souad',
                email: 'missing-fields@test.com'
            });

        expect(response.status).toBe(400);
    });


    test('POST /api/auth/login - should reject an unknown email', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'unknown@test.com',
                password: 'Password123'
            });

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Invalid credentials');
    });



    test('POST /api/auth/login - should not return the password', async () => {
        await User.create({
            ...testUser,
            role: 'learner',
            status: 'active'
        });

        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: testUser.email,
                password: testUser.password
            });

        expect(response.status).toBe(200);
        expect(response.body.password).toBeUndefined();
        expect(response.body.user?.password).toBeUndefined();
    });


    test('POST /api/auth/login - should reject a missing password', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'learner@test.com'
            });

        expect(response.status).toBe(400);
    });


});
