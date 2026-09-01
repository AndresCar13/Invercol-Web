import { useEffect, useState } from 'react';
import './PropertySearch.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

function PropertySearch() {
  const [catalogs, setCatalogs] = useState({ propertyTypes: [], operationTypes: [], departments: [] });
  const [municipalities, setMunicipalities] = useState([]);
  const [form, setForm] = useState({ operation: '', propertyType: '', department: '', municipality: '' });

  useEffect(() => {
    fetch(`${API_URL}/properties/catalogs`)
      .then((response) => response.json())
      .then((result) => setCatalogs(result.data || { propertyTypes: [], operationTypes: [], departments: [] }))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const selectedDepartment = catalogs.departments.find((item) => item.nombre === form.department);
    if (!selectedDepartment) {
      setMunicipalities([]);
      return;
    }
    setForm((current) => ({ ...current, municipality: '' }));
    fetch(`${API_URL}/properties/municipalities?departmentId=${selectedDepartment.id}`)
      .then((response) => response.json())
      .then((result) => setMunicipalities(result.data || []))
      .catch(() => setMunicipalities([]));
  }, [form.department, catalogs.departments]);

  const change = ({ target }) => setForm((current) => ({ ...current, [target.name]: target.value }));

  function search(event) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (form.propertyType) params.set('tipo', form.propertyType);
    if (form.department) params.set('departamento', form.department);
    if (form.municipality.trim()) params.set('municipio', form.municipality.trim());
    window.location.href = `${form.operation ? `/${form.operation}` : '/propiedades'}${params.toString() ? `?${params}` : ''}`;
  }

  return (
    <section className="property-search">
      <div className="section-container">
        <div className="search-heading">
          <span>ENCUENTRA TU PROPIEDAD</span>
          <h2>¿Qué estás buscando?</h2>
        </div>
        <form className="search-form" onSubmit={search}>
          <select name="operation" value={form.operation} onChange={change}>
            <option value="">Operación</option>
            {catalogs.operationTypes.map((item) => <option key={item.id} value={item.nombre === 'VENTA' ? 'venta' : item.nombre === 'ARRIENDO' ? 'arriendo' : 'corta-estancia'}>{item.nombre.replace('_', ' ')}</option>)}
          </select>
          <select name="propertyType" value={form.propertyType} onChange={change}>
            <option value="">Tipo de inmueble</option>
            {catalogs.propertyTypes.map((item) => <option key={item.id} value={item.nombre}>{item.nombre}</option>)}
          </select>
          <select name="department" value={form.department} onChange={change}>
            <option value="">Departamento</option>
            {catalogs.departments.map((item) => <option key={item.id} value={item.nombre}>{item.nombre}</option>)}
          </select>
          <div className="search-municipality-field">
            <input name="municipality" value={form.municipality} onChange={change} list="municipality-options" type="text" placeholder="Ciudad o municipio" />
            <datalist id="municipality-options">
              {municipalities.map((item) => <option key={item.id} value={item.nombre} />)}
            </datalist>
          </div>
          <button type="submit">Buscar</button>
        </form>
      </div>
    </section>
  );
}

export default PropertySearch;
