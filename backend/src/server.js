require('dotenv').config();

const app = require('./app');
const pool = require('./config/database');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await pool.query('SELECT NOW()');

    console.log('Conexión a PostgreSQL establecida');

    app.listen(PORT, () => {
      console.log(`Servidor Invercol ejecutándose en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('No fue posible conectar con PostgreSQL:', error);
    process.exit(1);
  }
};

startServer();
