import './Footer.css';
import './BrandOverrides.css';

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-brand">
          <img className="footer-logo" src="/images/invercol-logo.svg" alt="Invercol" />

          <p>Soluciones inmobiliarias para encontrar el lugar adecuado.</p>
        </div>

        <div className="footer-column">
          <h4>Navegación</h4>

          <a href="/">Inicio</a>
          <a href="/venta">Venta</a>
          <a href="/arriendo">Arriendo</a>
          <a href="/nosotros">Nosotros</a>
        </div>

        <div className="footer-column">
          <h4>Contacto</h4>

          <p>Bucaramanga, Santander</p>

          <p>ventas@inmobiliariainvercol.com</p>

          <p>313 333 2780</p>
        </div>

        <div className="footer-column footer-admin-link">
          <h4>Administración</h4>
          <a href="/admin/login">Acceso administrador</a>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} INVERCOL. Todos los derechos reservados.
      </div>
    </footer>
  );
}

export default Footer;
