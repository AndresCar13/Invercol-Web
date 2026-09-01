const pool = require('../config/database');
const { verifyToken } = require('../utils/jwt');

const authenticate = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      return res.status(401).json({
        success: false,
        message: 'Token de autenticación requerido',
      });
    }

    const [scheme, token] = authorization.split(' ');

    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({
        success: false,
        message: 'Formato de autorización inválido',
      });
    }

    // Verifica firma y expiración del JWT
    const decoded = verifyToken(token);

    // Comprueba el estado y rol directamente en PostgreSQL
    const result = await pool.query(
      `
            SELECT
                u.id,
                u.nombres,
                u.apellidos,
                u.email,
                u.estado,
                r.nombre AS role
            FROM usuarios u
            INNER JOIN roles r
            ON r.id = u.rol_id
            WHERE u.id = $1
            LIMIT 1;
            `,
      [decoded.id],
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no encontrado',
      });
    }

    const user = result.rows[0];

    // La base de datos tiene prioridad sobre el JWT
    if (user.estado !== 'ACTIVO') {
      return res.status(401).json({
        success: false,
        message: 'Usuario inactivo o suspendido',
      });
    }

    req.user = {
      id: user.id,
      nombres: user.nombres,
      apellidos: user.apellidos,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    console.error('Error de autenticación:', error.message);

    return res.status(401).json({
      success: false,
      message: 'Token inválido o expirado',
    });
  }
};

const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Autenticación requerida',
    });
  }

  if (req.user.role !== 'ADMINISTRADOR') {
    return res.status(403).json({
      success: false,
      message: 'No tienes permisos de administrador',
    });
  }

  next();
};

module.exports = {
  authenticate,
  requireAdmin,
};
