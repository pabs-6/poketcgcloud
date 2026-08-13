import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app.js';
import { User } from '../models/User.js';
import { connectDatabase, disconnectDatabase } from '../config/database.js';

beforeAll(async () => {
  await connectDatabase();
});

afterAll(async () => {
  await User.deleteMany({});
  await disconnectDatabase();
});

describe('Auth API', () => {
  const testUser = {
    email: 'test@example.com',
    password: 'password123',
    username: 'testuser',
  };

  let token: string;

  it('POST /api/auth/register - creates user', async () => {
    const res = await request(app).post('/api/auth/register').send(testUser);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(testUser.email);
    expect(res.body.data.user.password).toBeUndefined();
    expect(res.body.data.token).toBeDefined();
    token = res.body.data.token;
  });

  it('POST /api/auth/login - returns token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: testUser.password });

    expect(res.status).toBe(200);
    expect(res.body.data.token).toBeDefined();
  });

  it('GET /api/auth/me - returns profile', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.username).toBe(testUser.username);
    expect(res.body.data.passwordHash).toBeUndefined();
  });

  it('GET /api/health - returns ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('ok');
  });
});

describe('Collection API', () => {
  let token: string;
  let userId: string;

  beforeAll(async () => {
    await User.deleteMany({ email: 'collector@example.com' });
    const res = await request(app).post('/api/auth/register').send({
      email: 'collector@example.com',
      password: 'password123',
      username: 'collector',
    });
    token = res.body.data.token;
    userId = res.body.data.user.id;
  });

  afterAll(async () => {
    await User.deleteOne({ _id: userId });
  });

  it('GET /api/collection - requires auth', async () => {
    const res = await request(app).get('/api/collection');
    expect(res.status).toBe(401);
  });

  it('GET /api/collection - returns empty array', async () => {
    const res = await request(app)
      .get('/api/collection')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([]);
  });
});
