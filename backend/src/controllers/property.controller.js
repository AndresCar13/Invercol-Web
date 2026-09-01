const propertyService = require('../services/property.service');

const catalogs = async (req, res) => {
  try { res.json({ success: true, data: await propertyService.listCatalogs() }); }
  catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

const municipalities = async (req, res) => {
  try { res.json({ success: true, data: await propertyService.listMunicipalities(req.query.departmentId) }); }
  catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

const list = async (req, res) => {
  try { res.json({ success: true, data: await propertyService.list(req.query.status) }); }
  catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

const get = async (req, res) => {
  try {
    const property = await propertyService.get(req.params.id);
    if (!property) return res.status(404).json({ success: false, message: 'Inmueble no encontrado.' });
    return res.json({ success: true, data: property });
  } catch (error) { return res.status(500).json({ success: false, message: error.message }); }
};

const update = async (req, res) => {
  try {
    const payload = { ...req.body, operations: req.body.operations ? JSON.parse(req.body.operations) : [], replaceImages: req.body.replaceImages === 'true', existingImages: req.body.existingImages ? JSON.parse(req.body.existingImages) : [], imageOrder: req.body.imageOrder ? JSON.parse(req.body.imageOrder) : [], images: (req.files || []).map((file) => ({ url: `/uploads/properties/${file.filename}`, filename: file.originalname, altText: req.body.title, sizeBytes: file.size, mimeType: file.mimetype })) };
    return res.json({ success: true, data: await propertyService.update(req.params.id, payload) });
  }
  catch (error) { return res.status(400).json({ success: false, message: error.message }); }
};

const remove = async (req, res) => {
  try { return res.json({ success: true, data: await propertyService.remove(req.params.id) }); }
  catch (error) { return res.status(400).json({ success: false, message: error.message }); }
};

const create = async (req, res) => {
  try {
    const { code, title, propertyTypeId, departmentId, municipalityId } = req.body;
    if (!code || !title || !propertyTypeId || !departmentId || !municipalityId) {
      return res.status(400).json({ success: false, message: 'Código, título, tipo, departamento y municipio son obligatorios.' });
    }
    const payload = {
      ...req.body,
      operations: req.body.operations ? JSON.parse(req.body.operations) : [],
      amenityIds: req.body.amenityIds ? JSON.parse(req.body.amenityIds) : [],
      images: (req.files || []).map((file) => ({
        url: `/uploads/properties/${file.filename}`,
        filename: file.originalname,
        altText: req.body.title,
        sizeBytes: file.size,
        mimeType: file.mimetype,
      })),
    };
    const property = await propertyService.create(payload, req.user.id);
    return res.status(201).json({ success: true, data: property });
  } catch (error) {
    console.error('Error creando publicación:', error.message);
    return res.status(400).json({ success: false, message: error.code === '23505' ? 'El código de publicación ya existe.' : error.message });
  }
};

module.exports = { catalogs, municipalities, list, get, create, update, remove };
