@echo off
echo Installation des dependances du serveur...
npm install --prefix . express multer cors

echo.
echo Demarrage du serveur de documents...
echo Le serveur sera accessible sur: http://localhost:5000
echo Les documents seront stockes dans: public/documents/
echo.
node server.js
pause 