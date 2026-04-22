import express from 'express';
import Book from '../models/Book.js';
import auth from '../middleware/auth.js';
import isAdmin from '../middleware/admin.js';

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.post('/', auth, isAdmin, async (req, res) => {
  try {
    const { titre, auteur } = req.body;
    
    if (!titre || !auteur) {
      return res.status(400).json({ message: 'Titre et auteur requis' });
    }
    
    const book = await Book.create({ titre, auteur, etat: 'dispo' });
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: 'Livre supprimé' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

export default router;