import { useEffect, useMemo, useState } from 'react';
import Header from '../../components/layout/Header.jsx';
import Footer from '../../components/layout/Footer.jsx';
import './PublicProperties.css';
import './DetailOverrides.css';
import './DetailPosition.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const apiRoot = API_URL.replace('/api', '');
const money = (value) => value ? `$ ${Number(value).toLocaleString('es-CO')}` : 'Consultar';

function PropertyDetail({ id }) {
  const [property, setProperty] = useState(null); const [selectedImage, setSelectedImage] = useState(0); const [error, setError] = useState('');
  useEffect(() => {
    fetch(`${API_URL}/properties/${id}`).then((r) => r.json()).then((r) => {
      if (!r.success) throw new Error(r.message);
      setProperty(r.data);
      const viewedKey = `invercol_viewed_${id}`;
      if (!sessionStorage.getItem(viewedKey)) {
        sessionStorage.setItem(viewedKey, '1');
        fetch(`${API_URL}/properties/${id}/view`, { method: 'POST' }).catch(() => {});
      }
    }).catch((e) => setError(e.message));
  }, [id]);
  const images = useMemo(() => property?.imagenes || [], [property]); const operation = property?.operaciones?.[0];
  const goBack = (event) => { event.preventDefault(); if (window.history.length > 1) window.history.back(); else window.location.href = '/'; };
  if (error) return <><Header /><main className="property-detail-page"><div className="property-detail-container"><h1>Inmueble no encontrado</h1><p>{error}</p></div></main><Footer /></>;
  if (!property) return <><Header /><main className="property-detail-page"><div className="property-detail-container property-loading">Cargando inmueble…</div></main><Footer /></>;
  return <><Header /><main className="property-detail-page"><div className="property-detail-container"><a href="/" className="detail-back" onClick={goBack}>← Volver al portafolio</a><div className="detail-hero"><div className="property-gallery"><div className="gallery-main">{images.length ? <img src={`${apiRoot}${images[selectedImage]?.url || images[0].url}`} alt={property.titulo} /> : <div className="gallery-empty">INVERCOL</div>}<span className="gallery-count">{images.length ? `${selectedImage + 1} / ${images.length}` : 'Sin fotografías'}</span></div>{images.length > 1 && <div className="gallery-thumbnails">{images.map((image, index) => <button className={index === selectedImage ? 'active' : ''} key={image.url} onClick={() => setSelectedImage(index)}><img src={`${apiRoot}${image.url}`} alt={`${property.titulo} ${index + 1}`} /></button>)}</div>}</div><aside className="detail-summary"><div className="detail-kicker"><span>{property.estado}</span><span>{property.tipo_inmueble}</span></div><h1>{property.titulo}</h1><p className="detail-location">⌖ {property.municipio}, {property.departamento}</p><p className="summary-description">{property.descripcion || 'Este inmueble no tiene una descripción disponible.'}</p><div className="price-card"><span className="price-label">{operation?.nombre || 'Disponible'}</span><strong>{money(operation?.valor)}</strong><span className="price-period">{operation?.periodo || 'Precio publicado'}</span>{operation?.cuota_administracion && <div className="admin-fee"><span>Administración</span><b>{money(operation.cuota_administracion)}</b></div>}<a className="contact-button" href="https://wa.me/573133332780" target="_blank" rel="noreferrer">Estoy interesado</a><a className="contact-phone" href="tel:+573133332780">313 333 2780</a></div><div className="reference-card"><span>Código del inmueble</span><strong>{property.codigo}</strong><p>Un asesor Invercol te acompañará durante todo el proceso.</p></div></aside></div><div className="detail-lower"><section className="detail-features"><h2>Características</h2><div className="feature-grid"><Feature label="Área total" value={property.area_total ? `${property.area_total} m²` : '—'} /><Feature label="Área construida" value={property.area_construida ? `${property.area_construida} m²` : '—'} /><Feature label="Habitaciones" value={property.habitaciones ?? '—'} /><Feature label="Baños" value={property.banos ?? '—'} /><Feature label="Parqueaderos" value={property.espacios_parqueadero ?? '—'} /><Feature label="Estrato" value={property.estrato ?? '—'} /></div></section></div></div></main><Footer /></>;
}
const Feature = ({ label, value }) => <div className="feature"><span>{label}</span><strong>{value}</strong></div>;
export default PropertyDetail;
