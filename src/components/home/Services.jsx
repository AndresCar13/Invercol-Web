import './Services.css';

function Services() {
  const services = [
    {
      title: 'Venta',
      description:
        'Encuentra oportunidades inmobiliarias para invertir o construir tu próximo hogar.',
    },
    {
      title: 'Arriendo',
      description:
        'Propiedades para vivienda y negocio en diferentes ciudades y municipios.',
    },
    {
      title: 'Corta estancia',
      description:
        'Encuentra espacios ideales para estadías cortas y experiencias especiales.',
    },
    {
      title: 'Avalúos',
      description:
        'Conoce el valor comercial de tus propiedades con acompañamiento profesional.',
    },
  ];

  return (
    <section className="services">
      <div className="section-container">
        <div className="section-heading">
          <span>LO QUE HACEMOS</span>

          <h2>Soluciones inmobiliarias</h2>
        </div>

        <div className="services-grid">
          {services.map((service) => (
            <article className="service-card" key={service.title}>
              <span className="service-number">
                0{services.indexOf(service) + 1}
              </span>

              <h3>{service.title}</h3>

              <p>{service.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Services;
