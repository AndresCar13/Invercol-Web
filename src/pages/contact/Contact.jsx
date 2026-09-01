import { useState } from 'react';
import Header from '../../components/layout/Header.jsx';
import Footer from '../../components/layout/Footer.jsx';
import './Contact.css';

function Contact() {
  const [sent, setSent] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = `Solicitud de contacto - ${data.get('name')}`;
    const body = `Nombre: ${data.get('name')}\nCorreo: ${data.get('email')}\nTeléfono: ${data.get('phone')}\n\nMensaje:\n${data.get('message')}`;
    window.location.href = `mailto:ventas@inmobiliariainvercol.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  return (
    <>
      <Header />

      <main className="contact-page">
        <section className="contact-hero">
          <div className="contact-hero-ring contact-hero-ring-one" />
          <div className="contact-hero-ring contact-hero-ring-two" />
          <div className="contact-container contact-hero-content">
            <span className="contact-eyebrow">INVERCOL · HABLEMOS</span>
            <h1>Estamos para ayudarte a encontrar tu lugar.</h1>
            <p>Cuéntanos qué estás buscando y uno de nuestros asesores te acompañará con la atención que mereces.</p>
          </div>
          <div className="contact-hero-word" aria-hidden="true">HABLEMOS</div>
        </section>

        <section className="contact-main contact-container">
          <div className="contact-details">
            <div className="contact-section-label"><span>01</span><i /></div>
            <div>
              <span className="contact-kicker">Ponte en contacto</span>
              <h2>Una conversación puede ser el comienzo.</h2>
              <p className="contact-details-intro">Ya sea que quieras comprar, vender, arrendar o encontrar una corta estancia, estamos listos para escucharte.</p>
            </div>

            <div className="contact-channels">
              <a href="https://wa.me/573133332780" target="_blank" rel="noreferrer" className="contact-channel">
                <span className="channel-icon">↗</span>
                <span><small>Escríbenos por WhatsApp</small><strong>313 333 2780</strong></span>
                <b>→</b>
              </a>
              <a href="mailto:ventas@inmobiliariainvercol.com" className="contact-channel">
                <span className="channel-icon">@</span>
                <span><small>Envíanos un correo</small><strong>ventas@inmobiliariainvercol.com</strong></span>
                <b>→</b>
              </a>
              <div className="contact-channel contact-channel-static">
                <span className="channel-icon">⌖</span>
                <span><small>Visítanos</small><strong>Bucaramanga, Santander</strong></span>
              </div>
            </div>
          </div>

          <div className="contact-form-card">
            <div className="form-card-heading">
              <span className="contact-kicker">Déjanos tus datos</span>
              <h2>¿En qué podemos ayudarte?</h2>
            </div>
            <form onSubmit={handleSubmit}>
              <label>Nombre completo<input name="name" type="text" placeholder="Tu nombre" required /></label>
              <div className="form-two-columns">
                <label>Correo electrónico<input name="email" type="email" placeholder="tu@correo.com" required /></label>
                <label>Teléfono<input name="phone" type="tel" placeholder="300 000 0000" /></label>
              </div>
              <label>Estoy interesado en
                <select name="interest" defaultValue="Comprar una propiedad">
                  <option>Comprar una propiedad</option>
                  <option>Arrendar una propiedad</option>
                  <option>Publicar mi propiedad</option>
                  <option>Corta estancia</option>
                  <option>Otro motivo</option>
                </select>
              </label>
              <label>Mensaje<textarea name="message" rows="4" placeholder="Cuéntanos un poco más..." required /></label>
              <button className="contact-submit" type="submit">Enviar mensaje <span>→</span></button>
              {sent && <p className="contact-success">Se abrió tu aplicación de correo para completar el mensaje.</p>}
            </form>
          </div>
        </section>

        <section className="contact-note">
          <div className="contact-container contact-note-inner">
            <span className="contact-kicker">Nuestro compromiso</span>
            <h2>Respuestas claras.<br /><em>Decisiones tranquilas.</em></h2>
            <p>En Invercol creemos en acompañarte con transparencia en cada paso.</p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Contact;
