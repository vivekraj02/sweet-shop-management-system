const express = require('express');
const { body, query, validationResult } = require('express-validator');
const router = express.Router();
const { authenticate, requireAdmin } = require('../middlewares/auth');
const sweetsController = require('../controllers/sweetsController');

// Public listing/search endpoints (allow guests to browse sweets)
router.get('/', sweetsController.listSweets);

router.get('/search', sweetsController.searchSweets);

router.post('/', authenticate, [
  body('name').notEmpty().withMessage('Name required'),
  body('category').notEmpty().withMessage('Category required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('quantity').isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer')
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  return sweetsController.createSweet(req, res, next);
});

router.put('/:id', authenticate, [
  body('price').optional().isFloat({ min: 0 }),
  body('quantity').optional().isInt({ min: 0 })
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  return sweetsController.updateSweet(req, res, next);
});

router.delete('/:id', authenticate, requireAdmin, sweetsController.deleteSweet);

router.post('/:id/purchase', authenticate, sweetsController.purchaseSweet);

router.post('/:id/restock', authenticate, requireAdmin, sweetsController.restockSweet);

module.exports = router;