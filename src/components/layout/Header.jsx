import './Header.css';
import './BrandOverrides.css';

function Header() {
  return (
    <header className="site-header">
      <div className="header-container">
        <a href="/" className="brand" aria-label="Invercol - inicio">
          <img src="/images/invercol-logo.svg" alt="Invercol Inversiones e Inmobiliaria del Oriente" />
        </a>

        <nav className="main-nav">
          <a href="/">Inicio</a>
          <a href="/venta">Venta</a>
          <a href="/arriendo">Arriendo</a>
          <a href="/corta-estancia">Corta estancia</a>
          <a href="/nosotros">Nosotros</a>
          <a href="/publicar">Servicios para propietarios</a>
          <a href="/contacto">Contacto</a>
        </nav>

        <button className="header-contact">Contáctanos</button>
      </div>
    </header>
  );
}

export default Header;
