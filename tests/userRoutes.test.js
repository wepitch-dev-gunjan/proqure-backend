const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app'); // Import the Express app directly
const User = require('../models/User');

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

describe('User Routes', () => {
  test('Register a new user', async () => {
    const res = await request(app)
      .post('/users/register')
      .send({
        name: 'John Doe',
        email: 'johndoe@example.com',
        phone_number: '1234567890',
        password: 'password123'
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  test('Login user', async () => {
    // First register a user
    await request(app)
      .post('/users/register')
      .send({
        name: 'John Doe',
        email: 'johndoe@example.com',
        phone_number: '1234567890',
        password: 'password123'
      });

    // Then login
    const res = await request(app)
      .post('/users/login')
      .send({
        email: 'johndoe@example.com',
        password: 'password123'
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  test('Get all users (admin only)', async () => {
    // Register an admin user
    const adminRes = await request(app)
      .post('/users/register')
      .send({
        name: 'Admin User',
        email: 'admin@example.com',
        phone_number: '1234567890',
        password: 'password123',
        user_type: 'admin'
      });

    const res = await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${adminRes.body.token}`);

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('Get the profile of the authenticated user', async () => {
    const userRes = await request(app)
      .post('/users/register')
      .send({
        name: 'John Doe',
        email: 'johndoe@example.com',
        phone_number: '1234567890',
        password: 'password123'
      });

    const res = await request(app)
      .get('/users/profile')
      .set('Authorization', `Bearer ${userRes.body.token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.email).toEqual('johndoe@example.com');
  });

  test('Edit the profile of the authenticated user', async () => {
    const userRes = await request(app)
      .post('/users/register')
      .send({
        name: 'John Doe',
        email: 'johndoe@example.com',
        phone_number: '1234567890',
        password: 'password123'
      });

    const res = await request(app)
      .put('/users/profile')
      .set('Authorization', `Bearer ${userRes.body.token}`)
      .send({
        name: 'John Smith'
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.name).toEqual('John Smith');
  });

  test('Delete a user by ID (admin only)', async () => {
    const adminRes = await request(app)
      .post('/users/register')
      .send({
        name: 'Admin User',
        email: 'admin@example.com',
        phone_number: '1234567890',
        password: 'password123',
        user_type: 'admin'
      });

    const userRes = await request(app)
      .post('/users/register')
      .send({
        name: 'John Doe',
        email: 'johndoe@example.com',
        phone_number: '1234567890',
        password: 'password123'
      });

    const res = await request(app)
      .delete(`/users/${userRes.body._id}`)
      .set('Authorization', `Bearer ${adminRes.body.token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.msg).toEqual('User removed');
  });

  test('Handle forgot password functionality', async () => {
    await request(app)
      .post('/users/register')
      .send({
        name: 'John Doe',
        email: 'johndoe@example.com',
        phone_number: '1234567890',
        password: 'password123'
      });

    const res = await request(app)
      .post('/users/forgot-password')
      .send({
        email: 'johndoe@example.com'
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.msg).toEqual('Recovery email sent');
  });

  test('Reset the user\'s password', async () => {
    await request(app)
      .post('/users/register')
      .send({
        name: 'John Doe',
        email: 'johndoe@example.com',
        phone_number: '1234567890',
        password: 'password123'
      });

    // Simulate forgot password to get the reset token
    await request(app)
      .post('/users/forgot-password')
      .send({
        email: 'johndoe@example.com'
      });

    const user = await User.findOne({ email: 'johndoe@example.com' });
    const resetToken = user.reset_password_token;

    const res = await request(app)
      .post('/users/reset-password')
      .send({
        token: resetToken,
        password: 'newpassword123'
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.msg).toEqual('Password has been reset');
  });
});
