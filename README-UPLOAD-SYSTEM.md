# Système d'Upload de Documents avec Sauvegarde Locale

Ce système permet d'uploader des documents qui sont d'abord sauvegardés localement dans le dossier `public/documents/`, puis les métadonnées (avec l'URL locale) sont envoyées vers votre API Java déployée.

## Architecture

```
Frontend React (port 3000)
    ↓ (upload fichier)
Serveur Local (port 3001) → Sauvegarde dans public/documents/
    ↓ (métadonnées + URL locale)
API Java (Railway) → Stockage en base de données
```

## Fonctionnalités

- ✅ Upload de fichiers vers serveur local
- ✅ Sauvegarde automatique dans `public/documents/`
- ✅ Génération d'URL locale unique
- ✅ Envoi des métadonnées vers API Java
- ✅ Interface utilisateur moderne avec drag & drop
- ✅ Gestion des erreurs et validation

## Structure des données envoyées à l'API Java

```json
{
  "name": "Mon premier document",
  "type": "PDF",
  "category": "Personnel",
  "url": "http://localhost:3001/documents/document-1234567890.pdf",
  "userId": 1,
  "description": "Description du document",
  "filename": "document-1234567890.pdf",
  "originalName": "mon-document.pdf",
  "size": 1024000
}
```

## Installation et démarrage

### 1. Démarrer le serveur local d'upload

**Option A: Script Windows**
```bash
# Double-cliquez sur start-local-server.bat
# Ou exécutez dans PowerShell:
.\start-local-server.bat
```

**Option B: Script PowerShell**
```powershell
.\start-local-server.ps1
```

**Option C: Manuel**
```bash
# Installer les dépendances
npm install express multer cors

# Démarrer le serveur local
node local-upload-server.js
```

### 2. Démarrer l'application React
```bash
npm start
```

## Utilisation

1. **Démarrer le serveur local** (port 3001) - voir installation ci-dessus
2. **Démarrer l'application React** (port 3000) : `npm start`
3. **Accéder à l'interface d'upload** : http://localhost:3000
4. **Uploader un document** via l'interface drag & drop
5. **Le fichier sera sauvegardé** dans `public/documents/`
6. **L'URL locale sera générée** : `http://localhost:3001/documents/filename.pdf`
7. **Les métadonnées seront envoyées** vers votre API Java avec cette URL locale

## Flux de données

### 1. Upload du fichier
```
Frontend → Serveur Local (3001) → public/documents/
```

### 2. Génération de l'URL locale
```
http://localhost:3001/documents/{filename}
```

### 3. Envoi vers API Java
```
Serveur Local → API Java (Railway)
Payload: {
  name: "Titre du document",
  type: "PDF",
  category: "Personnel",
  url: "http://localhost:3001/documents/document-123.pdf",
  userId: 1,
  description: "Description",
  filename: "document-123.pdf",
  originalName: "mon-document.pdf",
  size: 1024000
}
```

## API Endpoints

### Serveur Local (3001)
```
POST http://localhost:3001/api/local-upload
Content-Type: multipart/form-data

FormData:
- file: Le fichier à uploader

Response:
{
  "success": true,
  "data": {
    "filename": "document-123.pdf",
    "localUrl": "http://localhost:3001/documents/document-123.pdf",
    "originalName": "mon-document.pdf",
    "size": 1024000,
    "type": "PDF"
  }
}
```

### API Java (Railway)
```
POST https://itroaddocumentsservice-production.up.railway.app/api/documents
Content-Type: application/json

Payload: {
  "name": "Mon premier document",
  "type": "PDF",
  "category": "Personnel",
  "url": "http://localhost:3001/documents/document-123.pdf",
  "userId": 1,
  "description": "Description",
  "filename": "document-123.pdf",
  "originalName": "mon-document.pdf",
  "size": 1024000
}
```

## Structure des dossiers

```
itroadfrontend/
├── public/
│   └── documents/              # Dossier où sont stockés les fichiers
├── src/
│   ├── services/
│   │   └── documentUploadService.js  # Service d'upload local
│   ├── features/
│   │   └── document/
│   │       └── documentSlice.js      # Redux slice modifié
│   └── components/
│       └── documents/
│           └── AddDocument.jsx       # Interface d'upload
├── local-upload-server.js      # Serveur local d'upload
├── start-local-server.bat      # Script de démarrage Windows
├── start-local-server.ps1      # Script de démarrage PowerShell
└── README-UPLOAD-SYSTEM.md     # Ce fichier
```

## Types de fichiers supportés

- **Documents** : PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX
- **Images** : JPG, JPEG, PNG, GIF
- **Taille maximale** : 10MB par fichier

## Dépannage

### Le serveur local ne démarre pas
- Vérifiez que Node.js est installé
- Vérifiez que le port 3001 n'est pas utilisé
- Installez les dépendances : `npm install express multer cors`

### L'upload échoue
- Vérifiez que le serveur local (3001) est démarré
- Vérifiez que l'application React (3000) est démarrée
- Vérifiez que le fichier ne dépasse pas 10MB
- Vérifiez que le type de fichier est supporté

### L'API Java ne reçoit pas les données
- Vérifiez que l'URL de l'API est correcte
- Vérifiez que le serveur local génère bien l'URL locale
- Vérifiez les logs du serveur local pour les erreurs

### Les documents ne s'affichent pas
- Vérifiez que le dossier `public/documents/` existe
- Vérifiez que l'URL locale est accessible : `http://localhost:3001/documents/`
- Vérifiez les permissions du dossier

## Avantages de cette approche

1. **Sauvegarde locale** : Les fichiers sont stockés localement
2. **URL locale** : Chaque fichier a une URL locale accessible
3. **API Java** : Votre API reçoit les métadonnées avec l'URL locale
4. **Flexibilité** : Vous pouvez modifier l'URL locale selon vos besoins
5. **Sécurité** : Validation des fichiers côté serveur local 