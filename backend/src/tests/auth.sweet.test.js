const request = require('supertest');
const app = require('../../src/index');
const db = require('./setup');

beforeAll(async () => {
  await db.connect();
});

afterAll(async () => {
  await db.closeDatabase();
});

afterEach(async () => {
  await db.clearDatabase();
});

describe('Authentication API', () => {
  describe('POST /api/auth/register', () => {
    test('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('email', 'test@example.com');
      expect(response.body.user).toHaveProperty('role', 'user');
    });

    test('should register an admin user', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'admin@example.com',
          password: 'adminpass',
          role: 'admin'
        });

      expect(response.status).toBe(201);
      expect(response.body.user.role).toBe('admin');
    });

    test('should fail with invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'invalid-email',
          password: 'password123'
        });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    test('should fail with short password', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: '123'
        });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    test('should fail with duplicate email', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'duplicate@example.com',
          password: 'password123'
        });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'duplicate@example.com',
          password: 'password456'
        });

      expect(response.status).toBe(409);
      expect(response.body.message).toContain('User already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'login@example.com',
          password: 'password123'
        });
    });

    test('should login successfully with correct credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe('login@example.com');
    });

    test('should fail with wrong password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toContain('Invalid credentials');
    });

    test('should fail with non-existent email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toContain('Invalid credentials');
    });

    test('should fail with invalid email format', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'invalid-email',
          password: 'password123'
        });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
  });
});

describe('Sweets API', () => {
  let userToken, adminToken, sweetId;

  beforeEach(async () => {
    // Create test user
    const userRes = await request(app)
      .post('/api/auth/register')
      .send({ email: 'user@test.com', password: 'password123' });
    userToken = userRes.body.token;

    // Create test admin
    const adminRes = await request(app)
      .post('/api/auth/register')
      .send({ email: 'admin@test.com', password: 'adminpass', role: 'admin' });
    adminToken = adminRes.body.token;

    // Create test sweet
    const sweetRes = await request(app)
      .post('/api/sweets')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Test Sweet', category: 'Candy', price: 2.5, quantity: 10 });
    sweetId = sweetRes.body.sweet._id;
  });

  describe('GET /api/sweets', () => {
    test('should list all sweets for authenticated users', async () => {
      const response = await request(app)
        .get('/api/sweets')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.sweets)).toBe(true);
      expect(response.body.sweets.length).toBeGreaterThan(0);
    });

    test('should work without authentication for browsing', async () => {
      const response = await request(app)
        .get('/api/sweets');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.sweets)).toBe(true);
    });
  });

  describe('GET /api/sweets/search', () => {
    beforeEach(async () => {
      // Add more test sweets
      await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Caramel Sweet', category: 'Candy', price: 1.5, quantity: 20 });

      await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Chocolate Brownie', category: 'Bakery', price: 3.5, quantity: 5 });
    });

    test('should search by name', async () => {
      const response = await request(app)
        .get('/api/sweets/search')
        .query({ name: 'caramel' });

      expect(response.status).toBe(200);
      expect(response.body.sweets.length).toBe(1);
      expect(response.body.sweets[0].name).toBe('Caramel Sweet');
    });

    test('should search by category', async () => {
      const response = await request(app)
        .get('/api/sweets/search')
        .query({ category: 'Bakery' });

      expect(response.status).toBe(200);
      expect(response.body.sweets.length).toBe(1);
      expect(response.body.sweets[0].category).toBe('Bakery');
    });

    test('should filter by price range', async () => {
      const response = await request(app)
        .get('/api/sweets/search')
        .query({ minPrice: 1, maxPrice: 3 });

      expect(response.status).toBe(200);
      expect(response.body.sweets.length).toBe(2);
      response.body.sweets.forEach(sweet => {
        expect(sweet.price).toBeGreaterThanOrEqual(1);
        expect(sweet.price).toBeLessThanOrEqual(3);
      });
    });

    test('should combine multiple filters', async () => {
      const response = await request(app)
        .get('/api/sweets/search')
        .query({ name: 'sweet', category: 'Candy', minPrice: 1, maxPrice: 3 });

      expect(response.status).toBe(200);
      expect(response.body.sweets.length).toBe(2);
    });
  });

  describe('POST /api/sweets', () => {
    test('should create sweet as admin', async () => {
      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'New Sweet',
          category: 'Candy',
          price: 1.99,
          quantity: 15
        });

      expect(response.status).toBe(201);
      expect(response.body.sweet).toHaveProperty('name', 'New Sweet');
      expect(response.body.sweet).toHaveProperty('quantity', 15);
    });

    test('should fail without authentication', async () => {
      const response = await request(app)
        .post('/api/sweets')
        .send({
          name: 'New Sweet',
          category: 'Candy',
          price: 1.99,
          quantity: 15
        });

      expect(response.status).toBe(401);
    });

    test('should fail as regular user', async () => {
      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'New Sweet',
          category: 'Candy',
          price: 1.99,
          quantity: 15
        });

      expect(response.status).toBe(403);
    });


  });

  describe('PUT /api/sweets/:id', () => {
    test('should update sweet price as admin', async () => {
      const response = await request(app)
        .put(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ price: 3.99 });

      expect(response.status).toBe(200);
      expect(response.body.sweet.price).toBe(3.99);
    });

    test('should update sweet quantity as admin', async () => {
      const response = await request(app)
        .put(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: 25 });

      expect(response.status).toBe(200);
      expect(response.body.sweet.quantity).toBe(25);
    });

    test('should fail without authentication', async () => {
      const response = await request(app)
        .put(`/api/sweets/${sweetId}`)
        .send({ price: 3.99 });

      expect(response.status).toBe(401);
    });

    test('should fail as regular user', async () => {
      const response = await request(app)
        .put(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ price: 3.99 });

      expect(response.status).toBe(403);
    });

    test('should fail with invalid sweet ID', async () => {
      const response = await request(app)
        .put('/api/sweets/invalid-id')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ price: 3.99 });

      expect(response.status).toBe(404);
      expect(response.body.message).toContain('Sweet not found');
    });
  });

  describe('DELETE /api/sweets/:id', () => {
    test('should delete sweet as admin', async () => {
      const response = await request(app)
        .delete(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);

      // Verify deletion
      const checkResponse = await request(app)
        .get('/api/sweets')
        .set('Authorization', `Bearer ${userToken}`);

      expect(checkResponse.body.sweets.find(s => s._id === sweetId)).toBeUndefined();
    });

    test('should fail without authentication', async () => {
      const response = await request(app)
        .delete(`/api/sweets/${sweetId}`);

      expect(response.status).toBe(401);
    });

    test('should fail as regular user', async () => {
      const response = await request(app)
        .delete(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
    });
  });

  describe('POST /api/sweets/:id/purchase', () => {
    test('should purchase sweets successfully', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 3 });

      expect(response.status).toBe(200);
      expect(response.body.sweet.quantity).toBe(7); // 10 - 3
    });

    test('should fail without authentication', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .send({ quantity: 1 });

      expect(response.status).toBe(401);
    });

    test('should fail when purchasing more than available', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 15 });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Not enough quantity in stock');
    });


  });

  describe('POST /api/sweets/:id/restock', () => {
    test('should restock sweets as admin', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: 5 });

      expect(response.status).toBe(200);
      expect(response.body.sweet.quantity).toBe(15); // 10 + 5
    });

    test('should fail without authentication', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/restock`)
        .send({ quantity: 5 });

      expect(response.status).toBe(401);
    });

    test('should fail as regular user', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/restock`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 5 });

      expect(response.status).toBe(403);
    });


  });
});


