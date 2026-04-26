const express  = require('express');
const router   = express.Router();
const multer   = require('multer');
const path     = require('path');
const Material = require('../models/Material');
const { protect } = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename:    (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /pdf|doc|docx|ppt|pptx|png|jpg|jpeg/;
    cb(null, allowed.test(path.extname(file.originalname).toLowerCase()));
  }
});

router.get('/', async (req, res) => {
  try {
    const { subject, search } = req.query;
    let query = {};
    if (subject) query.subject = { $regex: subject, $options: 'i' };
    if (search) query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
    const materials = await Material.find(query).populate('uploader', 'name').sort({ createdAt: -1 });
    res.json(materials);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', protect, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const { title, description, subject, tags } = req.body;
    const material = await Material.create({
      title, description, subject,
      tags: tags ? tags.split(',').map(t => t.trim()) : [],
      fileUrl: `/uploads/${req.file.filename}`,
      fileType: req.file.mimetype,
      uploader: req.user._id
    });
    res.status(201).json(material);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;