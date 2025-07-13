// Service pour gérer l'upload local des documents
export class DocumentUploadService {
  static async saveFileLocally(file, title) {
    try {
      // Créer un FormData pour l'upload vers le serveur local
      const formData = new FormData();
      formData.append('file', file);
      
      // Uploader le fichier vers le serveur local
      const response = await fetch('http://localhost:3001/api/local-upload', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de l\'upload local');
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Erreur lors de l\'upload local');
      }
      
      return {
        filename: result.data.filename,
        localUrl: result.data.localUrl,
        originalName: result.data.originalName,
        size: result.data.size,
        type: result.data.type
      };
    } catch (error) {
      console.error('Erreur lors de la sauvegarde locale:', error);
      throw new Error('Impossible de sauvegarder le fichier localement: ' + error.message);
    }
  }

  static async uploadToServer(documentData, localFileInfo) {
    try {
      // Préparer les données pour l'API
      const payload = {
        name: documentData.title || localFileInfo.originalName,
        type: localFileInfo.type,
        category: documentData.category || 'Autre',
        url: localFileInfo.localUrl, // URL locale générée
        userId: documentData.userId || 1,
        description: documentData.description || '',
        filename: localFileInfo.filename,
        originalName: localFileInfo.originalName,
        size: localFileInfo.size
      };

      return payload;
    } catch (error) {
      console.error('Erreur lors de la préparation des données:', error);
      throw new Error('Impossible de préparer les données pour l\'upload');
    }
  }

  static cleanupBlobUrl(blobUrl) {
    // Cette méthode n'est plus nécessaire car nous n'utilisons plus de blob URLs
    // Gardée pour compatibilité
  }
} 