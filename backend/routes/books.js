import express from 'express';
import Book from '../models/Book.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Liste de tous les livres
router.get('/', auth, async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Ajouter un livre
router.post('/', auth, async (req, res) => {
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

// Supprimer un livre
router.delete('/:id', auth, async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: 'Livre supprimé' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

export default router;