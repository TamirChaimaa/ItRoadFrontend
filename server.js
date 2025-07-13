const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

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
  },
  fileFilter: function (req, file, cb) {
    // Vérifier les types de fichiers autorisés
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'image/jpeg',
      'image/png',
      'image/gif'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Type de fichier non autorisé'), false);
    }
  }
});

// Route pour uploader un document
app.post('/api/upload-document', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'Aucun fichier fourni' 
      });
    }

    // Construire l'URL du fichier
    const fileUrl = `${req.protocol}://${req.get('host')}/documents/${req.file.filename}`;
    
    // Préparer la réponse avec les données du document
    const documentData = {
      name: req.body.title || req.file.originalname,
      type: path.extname(req.file.originalname).toUpperCase().substring(1),
      category: req.body.category || 'Autre',
      url: fileUrl,
      userId: req.body.userId || 1,
      description: req.body.description || '',
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      uploadDate: new Date().toISOString()
    };

    res.json({
      success: true,
      message: 'Document uploadé avec succès',
      data: documentData
    });

  } catch (error) {
    console.error('Erreur lors de l\'upload:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'upload du document'
    });
  }
});

// Route pour récupérer tous les documents d'un utilisateur
app.get('/api/documents/:userId', (req, res) => {
  try {
    const uploadDir = path.join(__dirname, 'public/documents');
    
    if (!fs.existsSync(uploadDir)) {
      return res.json({
        success: true,
        data: []
      });
    }

    const files = fs.readdirSync(uploadDir);
    const documents = files.map(filename => {
      const filePath = path.join(uploadDir, filename);
      const stats = fs.statSync(filePath);
      const fileUrl = `${req.protocol}://${req.get('host')}/documents/${filename}`;
      
      return {
        id: filename,
        name: filename,
        type: path.extname(filename).toUpperCase().substring(1),
        category: 'Autre',
        url: fileUrl,
        userId: parseInt(req.params.userId),
        size: stats.size,
        uploadDate: stats.mtime.toISOString()
      };
    });

    res.json({
      success: true,
      data: documents
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des documents:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des documents'
    });
  }
});

// Route pour supprimer un document
app.delete('/api/documents/:filename', (req, res) => {
  try {
    const filePath = path.join(__dirname, 'public/documents', req.params.filename);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({
        success: true,
        message: 'Document supprimé avec succès'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Document non trouvé'
      });
    }

  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du document'
    });
  }
});

// Route de test
app.get('/api/test', (req, res) => {
  res.json({ message: 'Serveur de documents fonctionnel!' });
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
  console.log(`URL des documents: http://localhost:${PORT}/documents/`);
}); 