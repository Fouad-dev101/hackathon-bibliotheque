import express from 'express';
import Borrow from '../models/Borrow.js';
import Book from '../models/Book.js';
import auth from '../middleware/auth.js';
 
const router = express.Router();
 
// Emprunter un livre
router.post('/', auth, async (req, res) => {
  try {
    const { book_id } = req.body;
    const user_email = req.user.email;
    const book = await Book.findById(book_id);
    if (!book) {
      return res.status(404).json({ message: 'Livre non trouvé' });
    }
    if (book.etat === 'emprunte') {
      return res.status(400).json({ message: 'Livre déjà emprunté' });
    }
    await Borrow.create({ user_email, book_id });
    book.etat = 'emprunte';
    await book.save();
    res.json({ message: 'Livre emprunté avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});
 
// Rendre un livre
router.put('/return/:id', auth, async (req, res) => {
  try {
    const borrow_id = req.params.id;
    const user_email = req.user.email;
    const borrow = await Borrow.findOne({ _id: borrow_id, user_email });
    if (!borrow) {
      return res.status(404).json({ message: 'Emprunt non trouvé' });
    }
    borrow.date_retour = new Date();
    await borrow.save();
    await Book.findByIdAndUpdate(borrow.book_id, { etat: 'dispo' });
    res.json({ message: 'Livre retourné avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});
 
// Mes emprunts
router.get('/me', auth, async (req, res) => {
  try {
    const user_email = req.user.email;
    const borrows = await Borrow.find({ user_email })
      .populate('book_id', 'titre auteur')
      .sort({ date_emprunt: -1 });
    const formattedBorrows = borrows.map(borrow => ({
      id: borrow._id,
      titre: borrow.book_id.titre,
      auteur: borrow.book_id.auteur,
      date_emprunt: borrow.date_emprunt.toISOString().split('T')[0],
      date_retour: borrow.date_retour ? borrow.date_retour.toISOString().split('T')[0] : null,
      statut: borrow.date_retour ? 'terminé' : 'en cours'
    }));
    res.json(formattedBorrows);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});
 
export default router;