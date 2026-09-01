import { useEffect, useState } from 'react';
import Header from '../../components/layout/Header.jsx';
import Footer from '../../components/layout/Footer.jsx';
import PropertyCard from '../../components/properties/PropertyCard.jsx';
import './PublicProperties.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const operationNames = { venta: 'VENTA', arriendo: 'ARRIENDO', 'corta-estancia': 'CORTA_ESTANCIA' };

function PublicProperties({ operation }) {
  const [properties, setProperties] = useState([]);
  useEffect(() => { fetch(`${API_URL}/properties`).then((r) => r.json()).then((r) => setProperties(r.data || [])); }, []);
  const params = new URLSearchParams(window.location.search);
  const type = params.get('tipo')?.toLowerCase();
  const department = params.get('departamento')?.toLowerCase();
  const municipality = params.get('municipio')?.toLowerCase();
  const filtered = properties.filter((item) => {
    const operationMatch = operation ? item.operaciones?.some((entry) => entry.nombre === operationNames[operation]) : true;
    const typeMatch = type ? item.tipo_inmueble?.toLowerCase() === type : true;
    const departmentMatch = department ? item.departamento?.toLowerCase() === department : true;
    const municipalityMatch = municipality ? item.municipio?.toLowerCase().includes(municipality) : true;
    return operationMatch && typeMatch && departmentMatch && municipalityMatch;
  });
  return <><Header /><main className="public-properties"><div className="section-container"><span className="admin-eyebrow">INVERCOL · PORTAFOLIO</span><h1>{operation ? operation.replace('-', ' ') : 'Todos los inmuebles'}</h1><p>Encuentra el inmueble que estás buscando.</p><div className="properties-grid public-grid">{filtered.map((item) => <a href={`/inmueble/${item.id}`} key={item.id}><PropertyCard image={item.imagenes?.[0]?.url ? `${API_URL.replace('/api', '')}${item.imagenes[0].url}` : '/images/hero/hero-placeholder.svg'} type={item.tipo_inmueble} title={item.titulo} location={`${item.municipio || ''}, ${item.departamento || ''}`} price={item.operaciones?.[0]?.valor ? `$${Number(item.operaciones[0].valor).toLocaleString('es-CO')}` : 'Consultar'} operation={operation || 'Disponible'} /></a>)}</div>{filtered.length === 0 && <p className="public-empty">No hay inmuebles publicados en esta categoría.</p>}</div></main><Footer /></>;
}
export default PublicProperties;
