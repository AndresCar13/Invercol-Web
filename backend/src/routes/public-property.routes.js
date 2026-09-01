const express = require('express');
const propertyService = require('../services/property.service');

const router = express.Router();
router.get('/catalogs', async (req, res) => {
  try { res.json({ success: true, data: await propertyService.listCatalogs() }); }
  catch (error) { res.status(500).json({ success: false, message: error.message }); }
});
router.get('/municipalities', async (req, res) => {
  try { res.json({ success: true, data: await propertyService.listMunicipalities(req.query.departmentId) }); }
  catch (error) { res.status(500).json({ success: false, message: error.message }); }
});
router.get('/', async (req, res) => {
  try { res.json({ success: true, data: await propertyService.list('PUBLICADO') }); }
  catch (error) { res.status(500).json({ success: false, message: error.message }); }
});
router.get('/featured', async (req, res) => {
  try { res.json({ success: true, data: await propertyService.list('PUBLICADO', { sortByViews: true, limit: 3 }) }); }
  catch (error) { res.status(500).json({ success: false, message: error.message }); }
});
router.post('/:id/view', async (req, res) => {
  try {
    const data = await propertyService.recordView(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Inmueble no encontrado.' });
    return res.json({ success: true, data });
  } catch (error) { return res.status(500).json({ success: false, message: error.message }); }
});
router.get('/:id', async (req, res) => {
  try { const data = await propertyService.get(req.params.id); if (!data || data.estado !== 'PUBLICADO') return res.status(404).json({ success: false, message: 'Inmueble no encontrado.' }); res.json({ success: true, data }); }
  catch (error) { res.status(500).json({ success: false, message: error.message }); }
});
module.exports = router;
