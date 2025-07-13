Write-Host "Installation des dependances du serveur..." -ForegroundColor Green
npm install --prefix . express multer cors

Write-Host ""
Write-Host "Demarrage du serveur de documents..." -ForegroundColor Yellow
Write-Host "Le serveur sera accessible sur: http://localhost:5000" -ForegroundColor Cyan
Write-Host "Les documents seront stockes dans: public/documents/" -ForegroundColor Cyan
Write-Host ""
node server.js 