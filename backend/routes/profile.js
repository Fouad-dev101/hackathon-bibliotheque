import express from 'express';
import User from '../models/User.js';
import auth from '../middleware/auth.js';
import bcrypt from 'bcryptjs';
 
const router = express.Router();
 
// Obtenir mon profil
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});
 
// Modifier mon profil
router.put('/', auth, async (req, res) => {
  try {
    const { nom, prenom, password } = req.body;
    const updateData = { nom, prenom };
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }
    await User.findByIdAndUpdate(req.user.id, updateData);
    res.json({ message: 'Profil mis à jour' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});
 
export default router;