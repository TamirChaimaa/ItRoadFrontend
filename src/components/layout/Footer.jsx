import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 px-6 py-4">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm text-gray-600">
          © 2024 IT ROAD GROUP. Tous droits réservés.
        </p>
        <div className="flex space-x-4 mt-2 md:mt-0">
          <a href="#" className="text-sm text-gray-600 hover:text-cyan-600">
            Politique de confidentialité
          </a>
          <a href="#" className="text-sm text-gray-600 hover:text-cyan-600">
            Conditions d'utilisation
          </a>
          <a href="#" className="text-sm text-gray-600 hover:text-cyan-600">
            Support
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
