const request = require('supertest');  // Import supertest for API testing
const app = require('./server-side');  // Import the app instance (after export from server-side.js)

describe('Profile API tests', () => {
    let server;

    // Start the server before tests and close after tests
    beforeAll(() => {
        server = app.listen(3002);
    });

    afterAll(() => {
        server.close();
    });

    test('should save a new profile to profiles.json', async () => {
        const newProfile = {
            username: 'john_doe',
            bio: 'Software Developer',
            socialMedia: {
                facebook: 'john_doe_fb',
                twitter: 'john_doe_tw',
                instagram: 'john_doe_insta',
                snapchat: 'john_doe_snap',
                linkedin: 'john_doe_linkedin'
            }
        };

        const response = await request(app)
            .post('/api/save-profile')
            .send(newProfile);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
    });

    test('should update an existing profile', async () => {
        const initialProfile = {
            username: 'john_doe',
            bio: 'Software Developer',
            socialMedia: {
                facebook: 'john_doe_fb',
                twitter: 'john_doe_tw',
                instagram: 'john_doe_insta',
                snapchat: 'john_doe_snap',
                linkedin: 'john_doe_linkedin'
            }
        };

        // Save initial profile
        await request(app)
            .post('/api/save-profile')
            .send(initialProfile);

        const updatedProfile = {
            ...initialProfile,
            bio: 'Updated Bio'
        };

        // Update the profile
        const response = await request(app)
            .post('/api/save-profile')
            .send(updatedProfile);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
    });

    test('should return all profiles', async () => {
        const response = await request(app).get('/api/profiles');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
});
