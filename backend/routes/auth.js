import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    const { nom, prenom, email, password } = req.body;
    
    if (!nom || !prenom || !email || !password) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      nom,
      prenom,
      email,
      password: hashedPassword
    });
    
    res.status(201).json({ message: 'Inscription réussie' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }
    
    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.email, 
        nom: user.nom, 
        prenom: user.prenom, 
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({ 
      token, 
      user: { 
        id: user._id,
        nom: user.nom, 
        prenom: user.prenom, 
        email: user.email, 
        role: user.role 
      } 
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

export default router;