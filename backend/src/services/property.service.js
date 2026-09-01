const pool = require('../config/database');
const nullable = (value) => (value === '' || value === undefined ? null : value);

const listCatalogs = async () => {
  const [types, operations, departments, amenities] = await Promise.all([
    pool.query('SELECT id, nombre FROM tipos_inmueble WHERE activo = true ORDER BY nombre'),
    pool.query('SELECT id, nombre FROM tipos_operacion WHERE activo = true ORDER BY nombre'),
    pool.query('SELECT id, nombre, codigo FROM departamentos ORDER BY nombre'),
    pool.query('SELECT id, name, descripcion FROM comodidades WHERE activo = true ORDER BY name'),
  ]);
  return { propertyTypes: types.rows, operationTypes: operations.rows, departments: departments.rows, amenities: amenities.rows };
};

const listMunicipalities = async (departmentId) => (await pool.query('SELECT id, nombre, departamento_id FROM municipios WHERE departamento_id = $1 ORDER BY nombre', [departmentId])).rows;

const list = async (status, options = {}) => (await pool.query(`
  SELECT p.id, p.codigo, p.titulo, p.descripcion, p.estado, p.creado_en,
    pt.nombre AS tipo_inmueble, m.nombre AS municipio, d.nombre AS departamento,
    COALESCE(json_agg(DISTINCT jsonb_build_object('nombre', ot.nombre, 'valor', pp.valor, 'periodo', pp.periodo, 'cuota_administracion', pp.cuota_administracion)) FILTER (WHERE ot.id IS NOT NULL), '[]') AS operaciones,
    (SELECT COALESCE(jsonb_agg(jsonb_build_object('url', pi.url, 'portada', pi.portada, 'orden', pi.orden) ORDER BY pi.orden NULLS LAST, pi.id), '[]') FROM imagenes_inmueble pi WHERE pi.inmueble_id = p.id) AS imagenes
  FROM inmuebles p JOIN tipos_inmueble pt ON pt.id = p.tipo_inmueble_id
  LEFT JOIN ubicaciones_inmueble pl ON pl.inmueble_id = p.id LEFT JOIN municipios m ON m.id = pl.municipio_id
  LEFT JOIN departamentos d ON d.id = pl.departamento_id LEFT JOIN operaciones_inmueble po ON po.inmueble_id = p.id
  LEFT JOIN tipos_operacion ot ON ot.id = po.tipo_operacion_id LEFT JOIN precios_inmueble pp ON pp.operacion_inmueble_id = po.id
  GROUP BY p.id, pt.nombre, m.nombre, d.nombre
  ${status ? 'HAVING p.estado = $1' : ''}
  ORDER BY ${options.sortByViews ? 'p.vistas DESC, p.creado_en DESC' : 'p.creado_en DESC'}
  ${options.limit ? 'LIMIT $' + (status ? 2 : 1) : ''};
`, options.limit ? (status ? [status, options.limit] : [options.limit]) : (status ? [status] : []))).rows;

const recordView = async (id) => {
  const result = await pool.query("UPDATE inmuebles SET vistas = COALESCE(vistas, 0) + 1 WHERE id = $1 AND estado = 'PUBLICADO' RETURNING id, vistas", [id]);
  return result.rows[0];
};

const get = async (id) => (await pool.query(`
  SELECT p.*, pt.nombre AS tipo_inmueble, m.nombre AS municipio, d.nombre AS departamento,
    di.*, pl.departamento_id, pl.municipio_id, pl.direccion, pl.sector, pl.complemento,
    (SELECT COALESCE(jsonb_agg(jsonb_build_object('url', pi.url, 'portada', pi.portada, 'orden', pi.orden, 'nombre_archivo', pi.nombre_archivo) ORDER BY pi.orden NULLS LAST, pi.id), '[]') FROM imagenes_inmueble pi WHERE pi.inmueble_id = p.id) AS imagenes,
    COALESCE(json_agg(DISTINCT jsonb_build_object('tipo_operacion_id', po.tipo_operacion_id, 'nombre', ot.nombre, 'valor', pp.valor, 'periodo', pp.periodo, 'cuota_administracion', pp.cuota_administracion)) FILTER (WHERE po.id IS NOT NULL), '[]') AS operaciones
  FROM inmuebles p JOIN tipos_inmueble pt ON pt.id = p.tipo_inmueble_id
  LEFT JOIN ubicaciones_inmueble pl ON pl.inmueble_id = p.id LEFT JOIN municipios m ON m.id = pl.municipio_id
  LEFT JOIN departamentos d ON d.id = pl.departamento_id LEFT JOIN detalles_inmueble di ON di.inmueble_id = p.id
  LEFT JOIN operaciones_inmueble po ON po.inmueble_id = p.id LEFT JOIN tipos_operacion ot ON ot.id = po.tipo_operacion_id
  LEFT JOIN precios_inmueble pp ON pp.operacion_inmueble_id = po.id
  WHERE p.id = $1 GROUP BY p.id, pt.nombre, m.nombre, d.nombre, di.inmueble_id, pl.departamento_id, pl.municipio_id, pl.direccion, pl.sector, pl.complemento
`, [id])).rows[0];

const update = async (id, payload) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const property = await client.query('UPDATE inmuebles SET codigo=$1, titulo=$2, descripcion=$3, tipo_inmueble_id=$4, estado=$5, actualizado_en=NOW() WHERE id=$6 RETURNING id, codigo, titulo, descripcion, estado, actualizado_en', [payload.code, payload.title, nullable(payload.description), payload.propertyTypeId, payload.status || 'BORRADOR', id]);
    if (!property.rows[0]) throw new Error('Inmueble no encontrado.');
    await client.query('UPDATE detalles_inmueble SET area_total=$1, area_construida=$2, habitaciones=$3, banos=$4, medios_banos=$5, espacios_parqueadero=$6, piso=$7, total_pisos=$8, ano_construccion=$9, estrato=$10, actualizado_en=NOW() WHERE inmueble_id=$11', [nullable(payload.totalArea), nullable(payload.builtArea), nullable(payload.bedrooms), nullable(payload.bathrooms), nullable(payload.halfBathrooms), nullable(payload.parkingSpaces), nullable(payload.floor), nullable(payload.totalFloors), nullable(payload.yearBuilt), nullable(payload.stratum), id]);
    await client.query('UPDATE ubicaciones_inmueble SET departamento_id=$1, municipio_id=$2, sector=$3, direccion=$4, actualizado_en=NOW() WHERE inmueble_id=$5', [payload.departmentId, payload.municipalityId, nullable(payload.sector), nullable(payload.address), id]);
    if (payload.operations?.[0]) {
      await client.query('UPDATE operaciones_inmueble SET tipo_operacion_id=$1 WHERE id=(SELECT id FROM operaciones_inmueble WHERE inmueble_id=$2 ORDER BY creado_en LIMIT 1)', [payload.operations[0].operationTypeId, id]);
      await client.query("UPDATE precios_inmueble SET valor=$1, periodo=CASE WHEN (SELECT t.nombre FROM operaciones_inmueble o JOIN tipos_operacion t ON t.id=o.tipo_operacion_id WHERE o.id=precios_inmueble.operacion_inmueble_id)='ARRIENDO' THEN 'MES'::periodo_precio ELSE $2::periodo_precio END, cuota_administracion=$3 WHERE operacion_inmueble_id=(SELECT id FROM operaciones_inmueble WHERE inmueble_id=$4 ORDER BY creado_en LIMIT 1)", [payload.operations[0].amount, payload.operations[0].period || 'TOTAL', nullable(payload.operations[0].administrationFee), id]);
    }
    if (payload.replaceImages) {
      await client.query('DELETE FROM imagenes_inmueble WHERE inmueble_id=$1', [id]);
      const existingByUrl = new Map((payload.existingImages || []).map((image) => [image.url, image]));
      const newImages = payload.images || [];
      const images = payload.imageOrder?.length
        ? payload.imageOrder.map((item) => item.kind === 'existing' ? existingByUrl.get(item.key) : newImages[item.index]).filter(Boolean)
        : [...(payload.existingImages || []), ...newImages];
      for (const [index, image] of images.entries()) await client.query('INSERT INTO imagenes_inmueble (inmueble_id,url,nombre_archivo,texto_alternativo,orden,portada,tamano_bytes,tipo_mime) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)', [id, image.url, nullable(image.nombre_archivo || image.filename), nullable(image.texto_alternativo || image.altText), index, index === 0, image.tamano_bytes || image.sizeBytes || null, image.tipo_mime || image.mimeType || null]);
    }
    await client.query('COMMIT'); return property.rows[0];
  } catch (error) { await client.query('ROLLBACK'); throw error; } finally { client.release(); }
};

const remove = async (id) => {
  const result = await pool.query('DELETE FROM inmuebles WHERE id = $1 RETURNING id', [id]);
  return result.rows[0];
};

const create = async (payload, userId) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const property = await client.query(`INSERT INTO inmuebles (codigo, titulo, descripcion, tipo_inmueble_id, estado, creado_por)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, codigo, titulo, estado, creado_en`, [payload.code, payload.title, nullable(payload.description), payload.propertyTypeId, payload.status || 'BORRADOR', userId]);
    const id = property.rows[0].id;
    await client.query(`INSERT INTO detalles_inmueble (inmueble_id, area_total, area_construida, habitaciones, banos, medios_banos, espacios_parqueadero, piso, total_pisos, ano_construccion, estrato, tiene_ascensor, tiene_balcon, tiene_terraza, tiene_jardin, amoblado, apto_mascotas)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)`, [id, nullable(payload.totalArea), nullable(payload.builtArea), nullable(payload.bedrooms), nullable(payload.bathrooms), nullable(payload.halfBathrooms), nullable(payload.parkingSpaces), nullable(payload.floor), nullable(payload.totalFloors), nullable(payload.yearBuilt), nullable(payload.stratum), !!payload.hasElevator, !!payload.hasBalcony, !!payload.hasTerrace, !!payload.hasGarden, !!payload.furnished, !!payload.petFriendly]);
    await client.query(`INSERT INTO ubicaciones_inmueble (inmueble_id, departamento_id, municipio_id, sector, tipo_sector, direccion, complemento, latitude, longitude, mostrar_direccion_exacta)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`, [id, payload.departmentId, payload.municipalityId, nullable(payload.sector), nullable(payload.sectorType), nullable(payload.address), nullable(payload.complement), nullable(payload.latitude), nullable(payload.longitude), !!payload.showExactAddress]);
    for (const operation of payload.operations || []) {
      const op = await client.query('INSERT INTO operaciones_inmueble (inmueble_id, tipo_operacion_id, activo) VALUES ($1,$2,true) RETURNING id', [id, operation.operationTypeId]);
      const operationType = await client.query('SELECT nombre FROM tipos_operacion WHERE id=$1', [operation.operationTypeId]);
      const period = operationType.rows[0]?.nombre === 'ARRIENDO' ? 'MES' : operation.period || 'TOTAL';
      await client.query('INSERT INTO precios_inmueble (operacion_inmueble_id, valor, moneda, periodo, cuota_administracion, deposito) VALUES ($1,$2,\'COP\',$3,$4,$5)', [op.rows[0].id, operation.amount, period, nullable(operation.administrationFee), nullable(operation.depositAmount)]);
    }
    for (const amenityId of payload.amenityIds || []) await client.query('INSERT INTO comodidades_inmueble (inmueble_id, comodidad_id) VALUES ($1,$2)', [id, amenityId]);
    for (const [index, image] of (payload.images || []).entries()) await client.query('INSERT INTO imagenes_inmueble (inmueble_id, url, nombre_archivo, texto_alternativo, orden, portada, tamano_bytes, tipo_mime) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)', [id, image.url, nullable(image.filename), nullable(image.altText), index, index === 0, image.sizeBytes, image.mimeType]);
    await client.query('COMMIT');
    return property.rows[0];
  } catch (error) { await client.query('ROLLBACK'); throw error; } finally { client.release(); }
};

module.exports = { listCatalogs, listMunicipalities, list, recordView, get, create, update, remove };
