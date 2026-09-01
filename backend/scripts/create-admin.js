require('dotenv').config();

const bcrypt = require('bcryptjs');
const readline = require('readline');
const pool = require('../src/config/database');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (text) => {
  return new Promise((resolve) => {
    rl.question(text, resolve);
  });
};

const createAdmin = async () => {
  try {
    console.log('\n=== CREAR ADMINISTRADOR INVERCOL ===\n');

    const firstName = await question('Nombre: ');
    const lastName = await question('Apellido: ');
    const email = await question('Correo: ');
    const password = await question('Contraseña: ');

    if (!firstName || !lastName || !email || !password) {
      throw new Error('Todos los campos son obligatorios.');
    }

    if (password.length < 8) {
      throw new Error('La contraseña debe tener mínimo 8 caracteres.');
    }

    const existingUser = await pool.query(
      `
            SELECT id
            FROM usuarios
            WHERE LOWER(email) = LOWER($1)
            LIMIT 1;
            `,
      [email.trim()],
    );

    if (existingUser.rows.length > 0) {
      throw new Error('Ya existe un usuario con ese correo.');
    }

    const roleResult = await pool.query(
      `
            SELECT id
            FROM roles
            WHERE nombre = 'ADMINISTRADOR'
            LIMIT 1;
            `,
    );

    if (roleResult.rows.length === 0) {
      throw new Error('No existe el rol ADMINISTRADOR en la base de datos.');
    }

    const roleId = roleResult.rows[0].id;

    const passwordHash = await bcrypt.hash(password, 12);

    await pool.query(
      `
            INSERT INTO usuarios (
                rol_id,
                nombres,
                apellidos,
                email,
                hash_contrasena,
                estado
            )
            VALUES ($1, $2, $3, $4, $5, 'ACTIVO');
            `,
      [
        roleId,
        firstName.trim(),
        lastName.trim(),
        email.trim().toLowerCase(),
        passwordHash,
      ],
    );

    console.log('\nAdministrador creado correctamente.');
    console.log(`Correo: ${email.trim().toLowerCase()}\n`);
  } catch (error) {
    console.error('\nError:', error.message);
  } finally {
    rl.close();
    await pool.end();
  }
};

createAdmin();
