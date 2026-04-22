import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  auteur: { type: String, required: true },
  etat: { type: String, default: 'dispo', enum: ['dispo', 'emprunte'] }
}, { timestamps: true });

export default mongoose.model('Book', bookSchema);