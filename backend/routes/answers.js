const express  = require('express');
const router   = express.Router();
const Answer   = require('../models/Answer');
const Question = require('../models/Question');
const { protect } = require('../middleware/auth');

router.get('/:questionId', async (req, res) => {
  try {
    const answers = await Answer.find({ question: req.params.questionId })
      .populate('author', 'name reputation')
      .sort({ isAccepted: -1, votes: -1 });
    res.json(answers);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/:questionId', protect, async (req, res) => {
  try {
    const answer = await Answer.create({
      body: req.body.body, author: req.user._id, question: req.params.questionId
    });
    res.status(201).json(await answer.populate('author', 'name'));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/:id/accept', protect, async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    const question = await Question.findById(answer.question);
    if (question.author.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Only question author can accept' });
    await Answer.updateMany({ question: answer.question }, { isAccepted: false });
    answer.isAccepted = true; await answer.save();
    question.isSolved = true; question.acceptedAnswer = answer._id; await question.save();
    res.json({ message: 'Answer accepted!' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/:id/vote', protect, async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    const alreadyVoted = answer.voters.includes(req.user._id);
    if (alreadyVoted) { answer.voters.pull(req.user._id); answer.votes--; }
    else              { answer.voters.push(req.user._id); answer.votes++; }
    await answer.save();
    res.json({ votes: answer.votes });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;