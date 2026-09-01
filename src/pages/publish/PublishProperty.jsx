import Header from '../../components/layout/Header.jsx';
import Footer from '../../components/layout/Footer.jsx';
import './PublishProperty.css';

const services = [
  ['01', 'Venta de inmuebles', 'Analizamos tu propiedad, definimos una estrategia comercial y te acompañamos en la negociación hasta el cierre.'],
  ['02', 'Arriendo seguro', 'Buscamos el perfil adecuado de arrendatario y te orientamos en el contrato, la entrega y el inicio de la relación.'],
  ['03', 'Administración integral', 'Nos encargamos de la gestión cotidiana para que recibas tranquilidad y mantengas el control de tu patrimonio.'],
];

const management = [
  'Promoción y comercialización del inmueble',
  'Estudio y selección de arrendatarios',
  'Elaboración y seguimiento de contratos',
  'Recaudo y seguimiento de cánones',
  'Coordinación de mantenimientos y reparaciones',
  'Acompañamiento durante renovaciones y entregas',
];

const process = [
  ['01', 'Hablamos de tus objetivos', 'Nos reunimos para conocer el inmueble, tu situación y lo que esperas del proceso.'],
  ['02', 'Construimos el plan', 'Definimos el valor, las condiciones y la estrategia más conveniente para vender, arrendar o administrar.'],
  ['03', 'Nos encargamos de la gestión', 'Nuestro equipo atiende interesados, coordina visitas y mantiene una comunicación clara contigo.'],
  ['04', 'Te acompañamos hasta el final', 'Estamos presentes en la negociación, el contrato, la entrega y los pasos posteriores que correspondan.'],
];

function PublishProperty() {
  return (
    <>
      <Header />
      <main className="publish-page">
        <section className="publish-hero owner-hero">
          <div className="publish-hero-circle publish-hero-circle-one" />
          <div className="publish-hero-circle publish-hero-circle-two" />
          <div className="publish-container publish-hero-content">
            <span className="publish-eyebrow">INVERCOL · SERVICIOS PARA PROPIETARIOS</span>
            <h1>Tu inmueble, en manos de una inmobiliaria que está presente.</h1>
            <p>Si quieres vender, arrendar o delegar la administración de tu inmueble, conversemos. Te atendemos personalmente y construimos contigo la mejor forma de cuidar y mover tu patrimonio.</p>
            <div className="publish-hero-actions">
              <a href="https://wa.me/573133332780" target="_blank" rel="noreferrer">Hablar con un asesor <span>→</span></a>
              <a href="#servicios">Conocer nuestros servicios</a>
            </div>
          </div>
          <div className="publish-hero-word" aria-hidden="true">TU PATRIMONIO</div>
        </section>

        <section className="publish-intro publish-container">
          <div className="publish-section-number"><span>01</span><i /></div>
          <div>
            <span className="publish-kicker">Una relación de confianza</span>
            <h2>No se trata solo de encontrar un interesado.</h2>
          </div>
          <p className="publish-intro-text">Un inmueble necesita criterio, seguimiento y personas que respondan cuando hace falta. En Invercol somos una inmobiliaria física: te escuchamos, conocemos tu propiedad y te acompañamos durante todo el proceso.</p>
        </section>

        <section className="publish-services" id="servicios">
          <div className="publish-container">
            <div className="services-heading">
              <div><span className="publish-kicker">Cómo podemos ayudarte</span><h2>Elige el camino para tu inmueble.</h2></div>
              <p>Cuéntanos qué necesitas y te explicaremos con claridad las condiciones, responsabilidades y siguientes pasos.</p>
            </div>
            <div className="services-grid">
              {services.map(([number, title, text]) => <article className="service-card" key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p><a href="https://wa.me/573133332780" target="_blank" rel="noreferrer">Conversemos <b>↗</b></a></article>)}
            </div>
          </div>
        </section>

        <section className="publish-benefits">
          <div className="publish-container benefits-grid">
            <article className="benefit-feature">
              <span className="benefit-icon">✦</span>
              <span className="publish-kicker">Administración de inmuebles</span>
              <h2>Tu propiedad sigue siendo tuya. La gestión, la asumimos nosotros.</h2>
              <p>Ideal si vives en otra ciudad, tienes poco tiempo o prefieres contar con un equipo que atienda la operación y a tus arrendatarios.</p>
            </article>
            <div className="benefit-list">
              {management.map((item, index) => <div key={item}><span>{String(index + 1).padStart(2, '0')}</span><strong>{item}</strong><p>Con seguimiento y comunicación oportuna.</p></div>)}
            </div>
          </div>
        </section>

        <section className="publish-process publish-container" id="proceso">
          <div className="process-heading"><div><span className="publish-kicker">Así trabajamos</span><h2>Claro desde el primer encuentro.</h2></div><p>La confianza se construye con información precisa, acuerdos claros y presencia.</p></div>
          <div className="process-grid">{process.map(([number, title, text]) => <article className="process-card" key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
        </section>

        <section className="publish-info">
          <div className="publish-container info-grid">
            <div><span className="publish-kicker">Para comenzar</span><h2>Trae tus preguntas. Nosotros ponemos la experiencia.</h2><p>No necesitas tener todo resuelto. En una primera conversación revisamos la ubicación, el estado del inmueble, los documentos disponibles y tus expectativas.</p></div>
            <div className="info-checklist"><div><span>✓</span><p>Visita y valoración comercial del inmueble</p></div><div><span>✓</span><p>Orientación sobre documentos y condiciones</p></div><div><span>✓</span><p>Definición del servicio que mejor se adapta a ti</p></div><div><span>✓</span><p>Plan de trabajo y próximos pasos claros</p></div></div>
          </div>
        </section>

        <section className="publish-cta">
          <div className="publish-container publish-cta-inner"><div><span className="publish-kicker">Hablemos de tu inmueble</span><h2>Una buena gestión empieza con una conversación.</h2></div><div className="publish-cta-actions"><a href="https://wa.me/573133332780" target="_blank" rel="noreferrer">Escribir por WhatsApp <span>↗</span></a><a href="mailto:ventas@inmobiliariainvercol.com">Enviar un correo <span>↗</span></a></div></div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default PublishProperty;
