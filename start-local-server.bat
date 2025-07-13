@echo off
echo Installation des dependances du serveur local...
npm install --prefix . express multer cors

echo.
echo Demarrage du serveur d'upload local...
echo Le serveur sera accessible sur: http://localhost:3001
echo Les documents seront stockes dans: public/documents/
echo.
node local-upload-server.js
pause 