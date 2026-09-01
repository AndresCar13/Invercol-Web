import Header from '../../components/layout/Header.jsx';
import Footer from '../../components/layout/Footer.jsx';
import './About.css';

const values = [
  {
    number: '01',
    title: 'Confianza',
    text: 'Acompañamos cada decisión con información clara, honestidad y respaldo.'
  },
  {
    number: '02',
    title: 'Cercanía',
    text: 'Escuchamos lo que necesitas para convertir una búsqueda en una buena experiencia.'
  },
  {
    number: '03',
    title: 'Compromiso',
    text: 'Trabajamos con dedicación para cuidar tu patrimonio y ayudarte a avanzar.'
  }
];

function About() {
  return (
    <>
      <Header />

      <main className="about-page">
        <section className="about-hero">
          <div className="about-hero-orbit about-hero-orbit-one" />
          <div className="about-hero-orbit about-hero-orbit-two" />
          <div className="about-container about-hero-content">
            <span className="about-eyebrow">INVERCOL · SOBRE NOSOTROS</span>
            <h1>El lugar adecuado empieza con una buena decisión.</h1>
            <p>
              Somos una inmobiliaria del Oriente colombiano. Conectamos personas,
              proyectos y oportunidades para que encuentres un espacio que se sienta tuyo.
            </p>
          </div>
          <div className="about-hero-mark" aria-hidden="true">INVERCOL</div>
        </section>

        <section className="about-intro about-container">
          <div className="about-intro-label"><span>01</span><i /></div>
          <div>
            <p className="about-kicker">Más que propiedades</p>
            <h2>Construimos relaciones que encuentran su lugar.</h2>
          </div>
          <p className="about-intro-copy">
            En Invercol creemos que una propiedad no es solo metros cuadrados:
            es el comienzo de una nueva etapa, una inversión con propósito o el
            escenario de los momentos que importan.
          </p>
        </section>

        <section className="about-purpose">
          <div className="about-container purpose-grid">
            <article className="purpose-card purpose-card-main">
              <span className="purpose-icon">↗</span>
              <span className="about-kicker">Nuestra misión</span>
              <h2>Hacer más simple y confiable el camino hacia el lugar ideal.</h2>
              <p>
                Brindamos soluciones inmobiliarias cercanas, transparentes y
                profesionales, entendiendo las necesidades de cada persona para
                acompañarla de principio a fin.
              </p>
            </article>

            <article className="purpose-card purpose-card-vision">
              <span className="purpose-icon">✦</span>
              <span className="about-kicker">Nuestra visión</span>
              <h2>Ser la inmobiliaria de confianza para crecer en el Oriente colombiano.</h2>
              <p>
                Queremos ser reconocidos por nuestro servicio humano, nuestra
                experiencia y la capacidad de crear oportunidades que transformen
                la vida de nuestros clientes.
              </p>
            </article>
          </div>
        </section>

        <section className="about-values about-container">
          <div className="values-heading">
            <span className="about-kicker">Lo que nos mueve</span>
            <h2>Una forma de hacer las cosas.</h2>
          </div>
          <div className="values-grid">
            {values.map((value) => (
              <article className="value-card" key={value.number}>
                <span className="value-number">{value.number}</span>
                <h3>{value.title}</h3>
                <p>{value.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="about-cta">
          <div className="about-container about-cta-inner">
            <div>
              <span className="about-kicker">Tu próximo capítulo</span>
              <h2>Encuentra un espacio para lo que viene.</h2>
            </div>
            <a href="/venta" className="about-cta-button">Explorar propiedades <span>→</span></a>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default About;
