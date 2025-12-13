const Sweet = require('../models/sweet');

async function createSweet(req, res, next) {
  try {
    const { name, category, price, quantity } = req.body;
    const existing = await Sweet.findOne({ name });
    if (existing) return res.status(409).json({ message: 'Sweet with this name already exists' });
    const sweet = new Sweet({ name, category, price, quantity });
    await sweet.save();
    res.status(201).json({ sweet });
  } catch (err) {
    next(err);
  }
}

async function listSweets(req, res, next) {
  try {
    const sweets = await Sweet.find().sort({ name: 1 });
    res.json({ sweets });
  } catch (err) {
    next(err);
  }
}

async function searchSweets(req, res, next) {
  try {
    const { name, category, minPrice, maxPrice } = req.query;
    const query = {};
    if (name) query.name = { $regex: name, $options: 'i' };
    if (category) query.category = category;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    const sweets = await Sweet.find(query).sort({ name: 1 });
    res.json({ sweets });
  } catch (err) {
    next(err);
  }
}

async function updateSweet(req, res, next) {
  try {
    const id = req.params.id;
    const updates = req.body;
    const sweet = await Sweet.findByIdAndUpdate(id, updates, { new: true });
    if (!sweet) return res.status(404).json({ message: 'Sweet not found' });
    res.json({ sweet });
  } catch (err) {
    next(err);
  }
}

async function deleteSweet(req, res, next) {
  try {
    const id = req.params.id;
    const sweet = await Sweet.findByIdAndDelete(id);
    if (!sweet) return res.status(404).json({ message: 'Sweet not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
}

async function purchaseSweet(req, res, next) {
  try {
    const id = req.params.id;
    const { quantity = 1 } = req.body;
    const qty = Math.max(1, parseInt(quantity, 10));
    const sweet = await Sweet.findById(id);
    if (!sweet) return res.status(404).json({ message: 'Sweet not found' });
    if (sweet.quantity < qty) return res.status(400).json({ message: 'Not enough quantity in stock' });
    sweet.quantity -= qty;
    await sweet.save();
    res.json({ sweet });
  } catch (err) {
    next(err);
  }
}

async function restockSweet(req, res, next) {
  try {
    const id = req.params.id;
    const { quantity = 1 } = req.body;
    const qty = Math.max(1, parseInt(quantity, 10));
    const sweet = await Sweet.findById(id);
    if (!sweet) return res.status(404).json({ message: 'Sweet not found' });
    sweet.quantity += qty;
    await sweet.save();
    res.json({ sweet });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createSweet,
  listSweets,
  searchSweets,
  updateSweet,
  deleteSweet,
  purchaseSweet,
  restockSweet,
};
