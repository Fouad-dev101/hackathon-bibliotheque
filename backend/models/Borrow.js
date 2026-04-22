import mongoose from 'mongoose';
 
const borrowSchema = new mongoose.Schema({
  user_email: { type: String, required: true },
  book_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  date_emprunt: { type: Date, default: Date.now },
  date_retour: { type: Date, default: null }
}, { timestamps: true });
 
export default mongoose.model('Borrow', borrowSchema);