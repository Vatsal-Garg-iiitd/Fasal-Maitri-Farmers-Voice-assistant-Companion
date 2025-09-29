import express from 'express';
import User from '../models/User.js'; // Note the .js extension!

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, location, language } = req.body;
    const user = new User({ name, location, language });
    await user.save();
    res.status(201).json(user); // Return the user info with its generated _id
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { name, location, language } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, location, language },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
