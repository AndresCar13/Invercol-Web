const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const controller = require('../controllers/property.controller');
const { authenticate, requireAdmin } = require('../middleware/auth.middleware');

const router = express.Router();
const uploadDirectory = path.join(__dirname, '../../uploads/properties');
fs.mkdirSync(uploadDirectory, { recursive: true });
const storage = multer.diskStorage({
  destination: uploadDirectory,
  filename: (req, file, callback) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '-');
    callback(null, `${Date.now()}-${safeName}`);
  },
});
const upload = multer({
  storage,
  limits: { files: 20, fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, callback) => callback(null, file.mimetype.startsWith('image/')),
});
router.use(authenticate, requireAdmin);
router.get('/catalogs', controller.catalogs);
router.get('/municipalities', controller.municipalities);
router.get('/', controller.list);
router.get('/:id', controller.get);
router.post('/', upload.array('images', 20), controller.create);
router.put('/:id', upload.array('images', 20), controller.update);
router.delete('/:id', controller.remove);

module.exports = router;
