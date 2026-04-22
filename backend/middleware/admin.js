const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Accès non autorisé. Réservé aux administrateurs.' });
  }
  next();
};

export default isAdmin;