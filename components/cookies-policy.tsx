'use client'
import React from 'react';

export const Cookiespolicy = () => {
  return (
    <div className=" mx-auto p-6">
      <h1 className="text-5xl font-bold mb-10 text-center">Cookiespolicy</h1>
      <p className="mb-6">
      On this website, we use cookies. This cookie statement describes the use of cookies on{' '}
        <a href="hhttps://qrgen.clearq.se" className="hover:text-cyan-600 transition-colors underline">
          https://qrgen.clearq.se
        </a>
        , and the purposes for which we use cookies.
      </p>
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">Definitioner:</h2>
        <ul className="list-disc pl-6">
          <li>
            <strong>Cookies:</strong> technology that allows storing and reading information in your browser and can be used for many different purposes.
          </li>
          <li>
            <strong>First-party cookies:</strong> are cookies that are set by and used by this website.
          </li>
          <li>
            <strong>Third-party cookies: </strong> are cookies set and used by third parties, that is, other websites/services we use on this website. All third-party cookies on this site are documented by name.
          </li>
        </ul>
      </div>
      <p className="mb-6">This website uses both first-party cookies and third-party cookies.</p>
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">We use cookies for the following purposes:</h2>
        <ul className="list-disc pl-6">
          <li>
            <strong>Functional cookies:</strong> These are necessary cookies that ensure this website functions as it should.
          </li>
          <li>
            <strong>Analytics and statistics:</strong> These are cookies used for traffic measurement and analysis of usage patterns, etc.
          </li>
          <li>
            <strong>Personalization/customization:</strong> Cookies used to tailor the website based on what we know about you. For example, this could involve displaying information about products/services that we believe may be of interest to you because you have shown interest in the product/service during previous visits to the website.
          </li>
          <li>
            <strong>Marketing:</strong> These are cookies used to manage our marketing, such as displaying ads on other websites to those who have visited this site.
          </li>
          <li>
            <strong>Advertisement:</strong> These are cookies used to display ads on this website.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Cookiespolicy;
