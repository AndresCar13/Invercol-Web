const express = require('express');

const { authenticate, requireAdmin } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/dashboard', authenticate, requireAdmin, (req, res) => {
  res.json({
    success: true,
    message: 'Acceso autorizado al panel administrativo',
    user: req.user,
  });
});

module.exports = router;
