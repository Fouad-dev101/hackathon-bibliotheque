import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';

dotenv.config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    await User.deleteOne({ email: 'admin@bibliotheque.com' });

    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    await User.create({
      nom: 'Admin',
      prenom: 'Super',
      email: 'admin@bibliotheque.com',
      password: hashedPassword,
      role: 'admin'
    });

    console.log('👑 Admin créé avec succès !');
    console.log('📧 Email: admin@bibliotheque.com');
    console.log('🔑 Mot de passe: admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

createAdmin();