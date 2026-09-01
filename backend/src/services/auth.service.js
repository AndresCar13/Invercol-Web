const bcrypt = require('bcryptjs');
const pool = require('../config/database');
const { generateToken } = require('../utils/jwt');

const login = async (email, password) => {
  const query = `
        SELECT
            u.id,
            u.nombres,
            u.apellidos,
            u.email,
            u.hash_contrasena,
            u.estado,
            r.nombre AS role
        FROM usuarios u
        INNER JOIN roles r
            ON r.id = u.rol_id
        WHERE LOWER(u.email) = LOWER($1)
        LIMIT 1;
    `;

  const result = await pool.query(query, [email]);

  if (result.rows.length === 0) {
    throw new Error('Credenciales inválidas');
  }

  const user = result.rows[0];

  if (user.estado !== 'ACTIVO') {
    throw new Error('Usuario inactivo o suspendido');
  }

  const passwordValid = await bcrypt.compare(password, user.hash_contrasena);

  if (!passwordValid) {
    throw new Error('Credenciales inválidas');
  }

  await pool.query(
    `
        UPDATE usuarios
        SET ultimo_inicio_sesion_en = NOW()
        WHERE id = $1
        `,
    [user.id],
  );

  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    token,
    user: {
      id: user.id,
      nombres: user.nombres,
      apellidos: user.apellidos,
      email: user.email,
      role: user.role,
    },
  };
};

module.exports = {
  login,
};
