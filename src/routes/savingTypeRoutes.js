// routes/savingTypeRoutes.js
const express = require('express');
const router = express.Router();
const savingTypeController = require('../controllers/savingTypeController');
const { authenticate } = require('../middlewares/authMiddleware');
router.use(authenticate)
// POST: Create a new saving type
router.post('/', savingTypeController.createSavingType);

// GET: Get all saving types
router.get('/', savingTypeController.getAllSavingTypes);

// GET: Get a saving type by ID
router.get('/:id', savingTypeController.getSavingTypeById);

// PUT: Update a saving type by ID
router.put('/:id', savingTypeController.updateSavingType);

// DELETE: Delete a saving type by ID
router.delete('/:id', savingTypeController.deleteSavingType);

module.exports = router;
