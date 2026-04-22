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
    
    console.log('📖 Tentative emprunt:', { book_id, user_email });
    
    // Vérifier si le livre existe
    const book = await Book.findById(book_id);
    if (!book) {
      return res.status(404).json({ message: 'Livre non trouvé' });
    }
    
    // Vérifier si le livre est disponible
    if (book.etat === 'emprunte') {
      return res.status(400).json({ message: 'Ce livre est déjà emprunté' });
    }
    
    // Vérifier si l'utilisateur a déjà emprunté ce livre et ne l'a pas rendu
    const existingBorrow = await Borrow.findOne({ 
      user_email, 
      book_id, 
      date_retour: null 
    });
    
    if (existingBorrow) {
      return res.status(400).json({ message: 'Vous avez déjà emprunté ce livre' });
    }
    
    // Créer l'emprunt
    await Borrow.create({ user_email, book_id });
    
    // Mettre à jour l'état du livre
    book.etat = 'emprunte';
    await book.save();
    
    console.log('✅ Emprunt réussi');
    res.json({ message: 'Livre emprunté avec succès' });
    
  } catch (error) {
    console.error('❌ Erreur emprunt:', error);
    res.status(500).json({ message: 'Erreur serveur: ' + error.message });
  }
});

// Rendre un livre
router.put('/return/:id', auth, async (req, res) => {
  try {
    const borrow_id = req.params.id;
    const user_email = req.user.email;
    
    console.log('🔄 Tentative retour:', { borrow_id, user_email });
    
    const borrow = await Borrow.findOne({ _id: borrow_id, user_email });
    if (!borrow) {
      return res.status(404).json({ message: 'Emprunt non trouvé' });
    }
    
    if (borrow.date_retour) {
      return res.status(400).json({ message: 'Ce livre a déjà été retourné' });
    }
    
    borrow.date_retour = new Date();
    await borrow.save();
    
    await Book.findByIdAndUpdate(borrow.book_id, { etat: 'dispo' });
    
    console.log('✅ Retour réussi');
    res.json({ message: 'Livre retourné avec succès' });
    
  } catch (error) {
    console.error('❌ Erreur retour:', error);
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
      titre: borrow.book_id?.titre || 'Livre supprimé',
      auteur: borrow.book_id?.auteur || 'Auteur inconnu',
      date_emprunt: borrow.date_emprunt ? new Date(borrow.date_emprunt).toLocaleDateString('fr-FR') : 'Date inconnue',
      date_retour: borrow.date_retour ? new Date(borrow.date_retour).toLocaleDateString('fr-FR') : null,
      statut: borrow.date_retour ? 'terminé' : 'en cours'
    }));
    
    res.json(formattedBorrows);
  } catch (error) {
    console.error('❌ Erreur:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

export default router;