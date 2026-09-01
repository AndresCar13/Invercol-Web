import { useEffect, useState } from 'react';
import PropertyCard from '../properties/PropertyCard';
import './FeaturedProperties.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const API_ROOT = API_URL.replace('/api', '');

function FeaturedProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/properties/featured`)
      .then((response) => response.json())
      .then((result) => setProperties(result.data || []))
      .catch(() => setProperties([]))
      .finally(() => setLoading(false));
  }, []);

  const formatPrice = (property) => {
    const price = property.operaciones?.[0]?.valor;
    return price ? `$${Number(price).toLocaleString('es-CO')}` : 'Consultar';
  };

  return (
    <section className="featured-properties">
      <div className="section-container">
        <div className="section-heading">
          <span>NUESTRO PORTAFOLIO</span>
          <h2>Propiedades destacadas</h2>
          <p>Las propiedades que más están consultando nuestros visitantes.</p>
        </div>
        {loading && <p className="featured-status">Cargando propiedades destacadas...</p>}
        {!loading && properties.length === 0 && <p className="featured-status">Próximamente encontrarás aquí nuestras propiedades destacadas.</p>}
        <div className="properties-grid">
          {properties.map((property) => (
            <a href={`/inmueble/${property.id}`} key={property.id}>
              <PropertyCard
                image={property.imagenes?.[0]?.url ? `${API_ROOT}${property.imagenes[0].url}` : '/images/hero/hero-placeholder.svg'}
                type={property.tipo_inmueble}
                title={property.titulo}
                location={`${property.municipio || ''}, ${property.departamento || ''}`}
                price={formatPrice(property)}
                operation={property.operaciones?.[0]?.nombre || 'Disponible'}
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedProperties;
