# Système d'Upload de Documents

Ce système permet d'uploader des documents qui sont sauvegardés dans le dossier `public/documents/` et génère automatiquement une URL accessible.

## Fonctionnalités

- ✅ Upload de fichiers (PDF, DOC, XLS, PPT, Images)
- ✅ Sauvegarde automatique dans `public/documents/`
- ✅ Génération d'URL unique pour chaque document
- ✅ Interface utilisateur moderne avec drag & drop
- ✅ Gestion des erreurs et validation des types de fichiers
- ✅ Limite de taille : 10MB par fichier

## Structure des données

Chaque document uploadé génère une réponse avec cette structure :

```json
{
  "name": "Mon premier document",
  "type": "PDF",
  "category": "Personnel",
  "url": "http://localhost:5000/documents/document-1234567890.pdf",
  "userId": 1,
  "description": "Description du document",
  "filename": "document-1234567890.pdf",
  "originalName": "mon-document.pdf",
  "size": 1024000,
  "uploadDate": "2024-01-15T10:30:00.000Z"
}
```

## Installation et démarrage

### Option 1: Script automatique (Windows)
```bash
# Double-cliquez sur start-server.bat
# Ou exécutez dans PowerShell:
.\start-server.bat
```

### Option 2: Script PowerShell
```powershell
.\start-server.ps1
```

### Option 3: Manuel
```bash
# Installer les dépendances
npm install express multer cors

# Démarrer le serveur
node server.js
```

## Utilisation

1. **Démarrer le serveur backend** (voir installation ci-dessus)
2. **Démarrer l'application React** : `npm start`
3. **Accéder à l'interface d'upload** : http://localhost:3000
4. **Uploader un document** via l'interface drag & drop
5. **Le document sera sauvegardé** dans `public/documents/`
6. **L'URL sera générée** automatiquement et affichée

## API Endpoints

### Upload de document
```
POST http://localhost:5000/api/upload-document
Content-Type: multipart/form-data

FormData:
- file: Le fichier à uploader
- title: Titre du document
- description: Description (optionnel)
- category: Catégorie
- userId: ID de l'utilisateur
```

### Récupérer les documents d'un utilisateur
```
GET http://localhost:5000/api/documents/{userId}
```

### Supprimer un document
```
DELETE http://localhost:5000/api/documents/{filename}
```

### Accéder à un document
```
GET http://localhost:5000/documents/{filename}
```

## Structure des dossiers

```
itroadfrontend/
├── public/
│   └── documents/          # Dossier où sont stockés les fichiers
├── server.js              # Serveur Express
├── start-server.bat       # Script de démarrage Windows
├── start-server.ps1       # Script de démarrage PowerShell
└── src/
    └── components/
        └── documents/
            └── AddDocument.jsx  # Interface d'upload
```

## Types de fichiers supportés

- **Documents** : PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX
- **Images** : JPG, JPEG, PNG, GIF
- **Taille maximale** : 10MB par fichier

## Sécurité

- Validation des types MIME
- Génération de noms de fichiers uniques
- Limitation de la taille des fichiers
- Protection contre les injections de fichiers malveillants

## Dépannage

### Le serveur ne démarre pas
- Vérifiez que Node.js est installé
- Vérifiez que le port 5000 n'est pas utilisé
- Installez les dépendances : `npm install express multer cors`

### L'upload échoue
- Vérifiez que le serveur backend est démarré
- Vérifiez que le fichier ne dépasse pas 10MB
- Vérifiez que le type de fichier est supporté

### Les documents ne s'affichent pas
- Vérifiez que le dossier `public/documents/` existe
- Vérifiez les permissions du dossier
- Vérifiez que l'URL du serveur est correcte dans le frontend 