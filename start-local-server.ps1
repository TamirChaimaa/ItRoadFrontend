Write-Host "Installation des dependances du serveur local..." -ForegroundColor Green
npm install --prefix . express multer cors

Write-Host ""
Write-Host "Demarrage du serveur d'upload local..." -ForegroundColor Yellow
Write-Host "Le serveur sera accessible sur: http://localhost:3001" -ForegroundColor Cyan
Write-Host "Les documents seront stockes dans: public/documents/" -ForegroundColor Cyan
Write-Host ""
node local-upload-server.js 