const authService = require('../services/auth.service');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'El correo y la contraseña son obligatorios',
      });
    }

    const result = await authService.login(email.trim(), password);

    return res.status(200).json({
      success: true,
      message: 'Inicio de sesión exitoso',
      data: result,
    });
  } catch (error) {
    console.error('Error de login:', error.message);

    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  login,
};
