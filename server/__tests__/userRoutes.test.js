const request = require('supertest');
const app = require('../index');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User'); // Ensure this path is correct

let mongoServer;
let agent; // For maintaining session state

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  // Create a user in the in-memory database for testing
  const hashedPassword = await bcrypt.hash('correctpassword', 10);
  await User.create({
    firstName: 'John',
    lastName: 'Doe',
    email: 'correctemail@test.com',
    password: hashedPassword,
  });

  // Initialize agent for maintaining session
  agent = request.agent(app);
});

it('should return 401 for unauthorized login', async () => {
  const response = await agent
    .post('/api/login')
    .send({
      username: 'wrongemail@test.com',
      password: 'wrongpassword'
    });

  expect(response.status).toBe(401);
}, 10000);

it('should return 200 for successful login', async () => {
  const response = await agent
    .post('/api/login')
    .send({
      username: 'correctemail@test.com',
      password: 'correctpassword',
    });

  expect(response.status).toBe(200);
}, 10000);

it('should return 200 for correct logout', async () => {
  // Ensure user is logged in
  await agent
    .post('/api/login')
    .send({
      username: 'correctemail@test.com',
      password: 'correctpassword',
    });

  // Perform logout
  const response = await agent
    .post('/api/logout');

  expect(response.status).toBe(200);
}, 10000);

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});
