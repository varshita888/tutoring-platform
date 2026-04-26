const express  = require('express');
const router   = express.Router();
const Question = require('../models/Question');
const { protect } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const { search, tag, page = 1, limit = 10 } = req.query;
    let query = {};
    if (search) query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { body:  { $regex: search, $options: 'i' } }
    ];
    if (tag) query.tags = tag;
    const questions = await Question.find(query)
      .populate('author', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Question.countDocuments(query);
    res.json({ questions, total, pages: Math.ceil(total / limit) });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const q = await Question.findByIdAndUpdate(
      req.params.id, { $inc: { views: 1 } }, { new: true }
    ).populate('author', 'name');
    if (!q) return res.status(404).json({ message: 'Not found' });
    res.json(q);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', protect, async (req, res) => {
  try {
    const { title, body, tags } = req.body;
    const question = await Question.create({ title, body, tags: tags || [], author: req.user._id });
    res.status(201).json(await question.populate('author', 'name'));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/:id/vote', protect, async (req, res) => {
  try {
    const q = await Question.findById(req.params.id);
    if (!q) return res.status(404).json({ message: 'Not found' });
    const alreadyVoted = q.voters.includes(req.user._id);
    if (alreadyVoted) { q.voters.pull(req.user._id); q.votes--; }
    else              { q.voters.push(req.user._id); q.votes++; }
    await q.save();
    res.json({ votes: q.votes, voted: !alreadyVoted });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const q = await Question.findById(req.params.id);
    if (!q) return res.status(404).json({ message: 'Not found' });
    if (q.author.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });
    await q.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;