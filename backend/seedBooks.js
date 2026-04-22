import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Book from './models/Book.js';

dotenv.config();

const books = [
  { titre: "Le Petit Prince", auteur: "Antoine de Saint-Exupéry", etat: "dispo" },
  { titre: "1984", auteur: "George Orwell", etat: "dispo" },
  { titre: "Les Misérables", auteur: "Victor Hugo", etat: "dispo" },
  { titre: "L'Étranger", auteur: "Albert Camus", etat: "dispo" },
  { titre: "La Peste", auteur: "Albert Camus", etat: "dispo" },
  { titre: "Le Parfum", auteur: "Patrick Süskind", etat: "dispo" },
  { titre: "Crime et Châtiment", auteur: "Fiodor Dostoïevski", etat: "dispo" },
  { titre: "Madame Bovary", auteur: "Gustave Flaubert", etat: "dispo" },
  { titre: "Voyage au bout de la nuit", auteur: "Louis-Ferdinand Céline", etat: "dispo" },
  { titre: "Les Fleurs du mal", auteur: "Charles Baudelaire", etat: "dispo" },
  { titre: "Le Meilleur des mondes", auteur: "Aldous Huxley", etat: "dispo" },
  { titre: "Le Grand Gatsby", auteur: "F. Scott Fitzgerald", etat: "dispo" },
  { titre: "À la recherche du temps perdu", auteur: "Marcel Proust", etat: "dispo" },
  { titre: "Germinal", auteur: "Émile Zola", etat: "dispo" },
  { titre: "Bel-Ami", auteur: "Guy de Maupassant", etat: "dispo" },
  { titre: "Le Comte de Monte-Cristo", auteur: "Alexandre Dumas", etat: "dispo" },
  { titre: "Les Trois Mousquetaires", auteur: "Alexandre Dumas", etat: "dispo" },
  { titre: "Notre-Dame de Paris", auteur: "Victor Hugo", etat: "dispo" },
  { titre: "Candide", auteur: "Voltaire", etat: "dispo" },
  { titre: "Les Contes", auteur: "Charles Perrault", etat: "dispo" }
];

async function seedBooks() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB');
    
    await Book.deleteMany({});
    console.log('📚 Anciens livres supprimés');
    
    await Book.insertMany(books);
    console.log(`✅ ${books.length} livres ajoutés avec succès !`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

seedBooks();