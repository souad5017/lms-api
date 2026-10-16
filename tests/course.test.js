
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app.js';
import connectDB from '../src/config/db.js';
import Course from '../src/models/Course.js';
import User from '../src/models/User.js';

beforeAll(async () => {
    await connectDB();
});

afterEach(async () => {
    await Course.deleteMany({
        title: { $regex: /^Course Test/ }
    });

    await User.deleteMany({
        email: { $regex: /^course-test.*@test\.com$/ }
    });
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('Courses API', () => {

    test('GET /api/courses - should return only published courses', async () => {
        const trainer = await User.create({
            name: 'Course Test Trainer',
            email: 'course-test-trainer@test.com',
            password: 'Password123',
            role: 'trainer',
            status: 'active'
        });

        const learner = await User.create({
            name: 'Course Test Learner',
            email: 'course-test-learner@test.com',
            password: 'Password123',
            role: 'learner',
            status: 'active'
        });

        await Course.create([
            {
                title: 'Course Test Published',
                description: 'Published course for testing',
                level: 'beginner',
                category: 'Programming',
                duration: 10,
                status: 'published',
                trainer: trainer._id,
                publishedAt: new Date()
            },
            {
                title: 'Course Test Draft',
                description: 'Draft course for testing',
                level: 'beginner',
                category: 'Programming',
                duration: 5,
                status: 'draft',
                trainer: trainer._id
            }
        ]);

        const loginResponse = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'course-test-learner@test.com',
                password: 'Password123'
            });

        expect(loginResponse.status).toBe(200);

        const response = await request(app)
            .get('/api/courses')
            .set('Authorization', `Bearer ${loginResponse.body.token}`);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);

        expect(
            response.body.some(course => course.title === 'Course Test Published')
        ).toBe(true);

        expect(
            response.body.some(course => course.title === 'Course Test Draft')
        ).toBe(false);
    });


    test('GET /api/courses/:id - should return a published course', async () => {
        const trainer = await User.create({
            name: 'Course Test Trainer',
            email: 'course-test-trainer@test.com',
            password: 'Password123',
            role: 'trainer',
            status: 'active'
        });

        const learner = await User.create({
            name: 'Course Test Learner',
            email: 'course-test-learner@test.com',
            password: 'Password123',
            role: 'learner',
            status: 'active'
        });

        const course = await Course.create({
            title: 'Course Test Published By ID',
            description: 'Course detail test',
            level: 'beginner',
            category: 'Programming',
            duration: 10,
            status: 'published',
            trainer: trainer._id,
            publishedAt: new Date()
        });

        const loginResponse = await request(app)
            .post('/api/auth/login')
            .send({
                email: learner.email,
                password: 'Password123'
            });

        const response = await request(app)
            .get(`/api/courses/${course._id}`)
            .set('Authorization', `Bearer ${loginResponse.body.token}`);

        expect(response.status).toBe(200);
        expect(response.body.title).toBe('Course Test Published By ID');
        expect(response.body.status).toBe('published');
    });


    test('GET /api/courses/:id - should return 404 for a non-existent course', async () => {
        const learner = await User.create({
            name: 'Course Test Learner',
            email: 'course-test-learner@test.com',
            password: 'Password123',
            role: 'learner',
            status: 'active'
        });

        const loginResponse = await request(app)
            .post('/api/auth/login')
            .send({
                email: learner.email,
                password: 'Password123'
            });

        const nonExistentId = new mongoose.Types.ObjectId();

        const response = await request(app)
            .get(`/api/courses/${nonExistentId}`)
            .set('Authorization', `Bearer ${loginResponse.body.token}`);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Course not found');
    });


    test('POST /api/courses - should create a course as a trainer', async () => {
        const trainer = await User.create({
            name: 'Course Test Trainer',
            email: 'course-test-trainer@test.com',
            password: 'Password123',
            role: 'trainer',
            status: 'active'
        });

        const loginResponse = await request(app)
            .post('/api/auth/login')
            .send({
                email: trainer.email,
                password: 'Password123'
            });

        expect(loginResponse.status).toBe(200);

        const response = await request(app)
            .post('/api/courses')
            .set('Authorization', `Bearer ${loginResponse.body.token}`)
            .send({
                title: 'Course Test New Course',
                description: 'Course created by an authenticated trainer',
                objectives: ['Learn JavaScript', 'Practice coding'],
                level: 'beginner',
                category: 'Programming',
                duration: 10
            });
        // console.log(JSON.stringify(response.body, null, 2));

        // console.log('Status:', response.status);


        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Course created successfully');
        expect(response.body.course.title).toBe('Course Test New Course');
        expect(response.body.course.trainer).toBe(trainer._id.toString());
    });


    test('POST /api/courses - should reject a learner', async () => {
        const learner = await User.create({
            name: 'Course Test Learner',
            email: 'course-test-learner@test.com',
            password: 'Password123!',
            role: 'learner',
            status: 'active'
        });

        const loginResponse = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'course-test-learner@test.com',
                password: 'Password123!'
            });

        const token = loginResponse.body.token;

        const response = await request(app)
            .post('/api/courses')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Course Test Unauthorized',
                description: 'This course should not be created',
                objectives: ['Testing permissions'],
                level: 'beginner',
                category: 'Development',
                duration: 10
            });

        expect(response.status).toBe(403);
    });


    test('POST /api/courses - should reject unauthenticated requests', async () => {
        const response = await request(app)
            .post('/api/courses')
            .send({
                title: 'Course Test Unauthorized',
                description: 'This course should not be created',
                objectives: ['Testing authentication'],
                level: 'beginner',
                category: 'Development',
                duration: 10
            });

        expect(response.status).toBe(401);
    });


    test('PUT /api/courses/:id - should update own course as a trainer', async () => {
        const trainer = await User.create({
            name: 'Course Test Trainer',
            email: 'course-test-update@test.com',
            password: 'Password123!',
            role: 'trainer',
            status: 'active'
        });

        const loginResponse = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'course-test-update@test.com',
                password: 'Password123!'
            });

        const token = loginResponse.body.token;

        const course = await Course.create({
            title: 'Course Test Original',
            description: 'Original course description',
            objectives: ['Original objective'],
            level: 'beginner',
            category: 'Development',
            duration: 10,
            trainer: trainer._id
        });

        const response = await request(app)
            .put(`/api/courses/${course._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Course Test Updated',
                description: 'Updated course description',
                level: 'intermediate',
                category: 'Development',
                duration: 15
            });

        expect(response.status).toBe(200);
        expect(response.body.updateCourse.title).toBe('Course Test Updated');
    });

    test('PUT /api/courses/:id - should reject another trainer', async () => {
        const owner = await User.create({
            name: 'Course Test Owner',
            email: 'course-test-owner@test.com',
            password: 'Password123!',
            role: 'trainer',
            status: 'active'
        });

        const otherTrainer = await User.create({
            name: 'Course Test Other Trainer',
            email: 'course-test-other@test.com',
            password: 'Password123!',
            role: 'trainer',
            status: 'active'
        });

        const course = await Course.create({
            title: 'Course Test Owner Course',
            description: 'Course owned by another trainer',
            objectives: ['Testing ownership'],
            level: 'beginner',
            category: 'Development',
            duration: 10,
            trainer: owner._id
        });

        const loginResponse = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'course-test-other@test.com',
                password: 'Password123!'
            });

        const token = loginResponse.body.token;

        const response = await request(app)
            .put(`/api/courses/${course._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Course Test Unauthorized Update'
            });

        expect(response.status).toBe(403);
    });


    test('PATCH /api/courses/:id/publish - should publish own course as a trainer', async () => {
        const trainer = await User.create({
            name: 'Course Test Publisher',
            email: 'course-test-publisher@test.com',
            password: 'Password123!',
            role: 'trainer',
            status: 'active'
        });

        const course = await Course.create({
            title: 'Course Test To Publish',
            description: 'Course ready to be published',
            objectives: ['Test publishing'],
            level: 'beginner',
            category: 'Development',
            duration: 10,
            trainer: trainer._id,
            status: 'draft'
        });

        const loginResponse = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'course-test-publisher@test.com',
                password: 'Password123!'
            });

        const token = loginResponse.body.token;

        const response = await request(app)
            .patch(`/api/courses/${course._id}/publish`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
    });


    test('PATCH /api/courses/:id/unpublish - should unpublish own course as a trainer', async () => {
        const trainer = await User.create({
            name: 'Course Test Unpublisher',
            email: 'course-test-unpublisher@test.com',
            password: 'Password123!',
            role: 'trainer',
            status: 'active'
        });

        const course = await Course.create({
            title: 'Course Test To Unpublish',
            description: 'Course currently published',
            objectives: ['Test unpublishing'],
            level: 'beginner',
            category: 'Development',
            duration: 10,
            trainer: trainer._id,
            status: 'published',
            publishedAt: new Date()
        });

        const loginResponse = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'course-test-unpublisher@test.com',
                password: 'Password123!'
            });

        const token = loginResponse.body.token;

        const response = await request(app)
            .patch(`/api/courses/${course._id}/unpublish`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
    });


    test('PATCH /api/courses/:id/archive - should archive own course as a trainer', async () => {
        const trainer = await User.create({
            name: 'Course Test Archiver',
            email: 'course-test-archiver@test.com',
            password: 'Password123!',
            role: 'trainer',
            status: 'active'
        });

        const course = await Course.create({
            title: 'Course Test To Archive',
            description: 'Course ready to be archived',
            objectives: ['Test archiving'],
            level: 'beginner',
            category: 'Development',
            duration: 10,
            trainer: trainer._id,
            status: 'published',
            publishedAt: new Date()
        });

        const loginResponse = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'course-test-archiver@test.com',
                password: 'Password123!'
            });

        const token = loginResponse.body.token;

        const response = await request(app)
            .patch(`/api/courses/${course._id}/archive`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
    });



    test('PATCH /api/courses/:id/archive - should reject unauthenticated requests', async () => {
        const trainer = await User.create({
            name: 'Course Test No Auth',
            email: 'course-test-noauth@test.com',
            password: 'Password123!',
            role: 'trainer',
            status: 'active'
        });

        const course = await Course.create({
            title: 'Course Test Protected Archive',
            description: 'Course requiring authentication',
            objectives: ['Test authorization'],
            level: 'beginner',
            category: 'Development',
            duration: 10,
            trainer: trainer._id,
            status: 'published',
            publishedAt: new Date()
        });

        const response = await request(app)
            .patch(`/api/courses/${course._id}/archive`);

        expect(response.status).toBe(401);
    });


});
