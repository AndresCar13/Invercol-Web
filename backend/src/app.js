const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');
const propertyRoutes = require('./routes/property.routes');
const publicPropertyRoutes = require('./routes/public-property.routes');

const app = express();

app.use(cors());

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/auth', authRoutes);

app.use('/api/admin', adminRoutes);
app.use('/api/admin/properties', propertyRoutes);
app.use('/api/properties', publicPropertyRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Invercol API funcionando correctamente',
  });
});

module.exports = app;
