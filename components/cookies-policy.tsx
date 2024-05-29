'use client'
import React from 'react';

export const Cookiespolicy = () => {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Cookiespolicy</h1>
      <p className="mb-6">
        På denna webbplats använder vi cookies. Detta cookie-uttalande beskriver användningen av cookies på{' '}
        <a href="https://www.clearqr.se" className="text-blue-500 underline">
          https://www.clearqr.se
        </a>
        , samt vilka syften vi använder cookies för.
      </p>
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">Definitioner:</h2>
        <ul className="list-disc pl-6">
          <li>
            <strong>Cookies:</strong> en teknologi som gör det möjligt att lagra och läsa information i din webbläsare och som kan användas för många olika ändamål.
          </li>
          <li>
            <strong>Förstaparts-cookies:</strong> är cookies som sätts av och används av denna webbplats.
          </li>
          <li>
            <strong>Tredjeparts-cookies:</strong> är cookies som sätts och används av tredje parter, det vill säga andra webbplatser/tjänster vi använder på denna webbplats. Alla tredjeparts-cookies på denna webbplats är dokumenterade efter namn.
          </li>
        </ul>
      </div>
      <p className="mb-6">Denna webbplats använder både förstaparts-cookies och tredjeparts-cookies.</p>
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">Vi använder cookies för följande ändamål:</h2>
        <ul className="list-disc pl-6">
          <li>
            <strong>Funktionscookies:</strong> Dessa är nödvändiga cookies som ser till att denna webbplats fungerar som den ska.
          </li>
          <li>
            <strong>Analys och statistik:</strong> Detta är cookies som används för trafikmätningar och analys av användningsmönster etc.
          </li>
          <li>
            <strong>Personifiering/anpassning:</strong> Cookies som används för att anpassa webbplatsen baserat på vad vi vet om dig. Det kan till exempel vara att vi visar information om produkter/tjänster som vi tror kan vara intressanta för dig eftersom du har visat intresse för produkten/tjänsten vid tidigare besök på webbplatsen.
          </li>
          <li>
            <strong>Marknadsföring:</strong> Detta är cookies som används för att styra vår marknadsföring, till exempel genom att visa annonser på andra webbplatser till dem som har besökt denna webbplats.
          </li>
          <li>
            <strong>Annons:</strong> Detta är cookies som används för att visa annonser på denna webbplats.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Cookiespolicy;
