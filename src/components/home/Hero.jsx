import './Hero.css';

function Hero() {
  return (
    <section className="hero">
      <div className="hero-overlay"></div>

      <div className="hero-content">
        <span className="hero-label">INMOBILIARIA INVERCOL</span>

        <h1>
          Encuentra el lugar
          <br />
          ideal para ti
        </h1>

        <p>Propiedades para venta, arriendo y corta estancia.</p>

        <div className="hero-actions">
          <a href="/venta">Ver propiedades</a>

          <a href="/contacto">Habla con nosotros</a>
        </div>
      </div>
    </section>
  );
}

export default Hero;
