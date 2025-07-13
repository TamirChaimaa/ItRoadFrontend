const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3001; // Port différent du serveur React

// Middleware
app.use(cors());
app.use(express.json());
app.use('/documents', express.static(path.join(__dirname, 'public/documents')));

// Configuration de multer pour l'upload de fichiers
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'public/documents');
    
    // Créer le dossier s'il n'existe pas
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Générer un nom de fichier unique avec timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, extension);
    cb(null, nameWithoutExt + '-' + uniqueSuffix + extension);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max
  }
});

// Route pour uploader un fichier localement
app.post('/api/local-upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'Aucun fichier fourni' 
      });
    }

    // Construire l'URL locale du fichier
    const localUrl = `http://localhost:3001/documents/${req.file.filename}`;
    
    res.json({
      success: true,
      message: 'Fichier uploadé localement avec succès',
      data: {
        filename: req.file.filename,
        localUrl: localUrl,
        originalName: req.file.originalname,
        size: req.file.size,
        type: path.extname(req.file.originalname).toUpperCase().substring(1)
      }
    });

  } catch (error) {
    console.error('Erreur lors de l\'upload local:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'upload local du fichier'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Serveur d'upload local démarré sur le port ${PORT}`);
  console.log(`URL des documents: http://localhost:${PORT}/documents/`);
}); 