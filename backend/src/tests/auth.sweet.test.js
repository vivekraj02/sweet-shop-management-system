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

describe('Auth and Sweets API', () => {
  test('Register, login, create sweet, purchase and restock', async () => {
    // Register a user
    const userRes = await request(app).post('/api/auth/register')
      .send({ email: 'user@example.com', password: 'password123' });
    expect(userRes.statusCode).toBe(201);
    const userToken = userRes.body.token;

    // Register an admin
    const adminRes = await request(app).post('/api/auth/register')
      .send({ email: 'admin@example.com', password: 'adminpass', role: 'admin' });
    expect(adminRes.statusCode).toBe(201);
    const adminToken = adminRes.body.token;

    // Admin creates a sweet
    const createRes = await request(app)
      .post('/api/sweets')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Chocolate', category: 'Candy', price: 2.5, quantity: 10 });
    expect(createRes.statusCode).toBe(201);
    const sweetId = createRes.body.sweet._id;

    // Any user can list sweets
    const listRes = await request(app)
      .get('/api/sweets')
      .set('Authorization', `Bearer ${userToken}`);
    expect(listRes.statusCode).toBe(200);
    expect(listRes.body.sweets.length).toBe(1);

    // Purchase 2 chocolates as user
    const purchaseRes = await request(app)
      .post(`/api/sweets/${sweetId}/purchase`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ quantity: 2 });
    expect(purchaseRes.statusCode).toBe(200);
    expect(purchaseRes.body.sweet.quantity).toBe(8);

    // Restock 5 as admin
    const restockRes = await request(app)
      .post(`/api/sweets/${sweetId}/restock`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ quantity: 5 });
    expect(restockRes.statusCode).toBe(200);
    expect(restockRes.body.sweet.quantity).toBe(13);

    // Delete as admin
    const deleteRes = await request(app)
      .delete(`/api/sweets/${sweetId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(deleteRes.statusCode).toBe(200);
  });

  test('Search sweets by name and price range', async () => {
    const admin = await request(app).post('/api/auth/register').send({ email: 'admin2@example.com', password: 'adminpass', role: 'admin' });
    const token = admin.body.token;
    await request(app).post('/api/sweets').set('Authorization', `Bearer ${token}`).send({ name: 'Caramel', category: 'Candy', price: 1.5, quantity: 20 });
    await request(app).post('/api/sweets').set('Authorization', `Bearer ${token}`).send({ name: 'Brownie', category: 'Bakery', price: 3.5, quantity: 5 });

    // Search name
    const nameRes = await request(app).get('/api/sweets/search').set('Authorization', `Bearer ${token}`).query({ name: 'car' });
    expect(nameRes.statusCode).toBe(200);
    expect(nameRes.body.sweets.length).toBe(1);

    // Price range
    const priceRes = await request(app).get('/api/sweets/search').set('Authorization', `Bearer ${token}`).query({ minPrice: 1, maxPrice: 2 });
    expect(priceRes.statusCode).toBe(200);
    expect(priceRes.body.sweets.length).toBe(1);
  });
});
