'use client';
import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';

interface CookieConsent {
  accepted: boolean;
  denied: boolean;
  expiryTime?: number;
}

const COOKIE_NAME = 'cookieConsent';
const COOKIE_EXPIRY_MINUTES = 30; // Set to 24 hours

const CookieConsentBanner: React.FC = () => {
  const [accepted, setAccepted] = useState<boolean>(false);
  const [denied, setDenied] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  const handleAccept = () => {
    setAccepted(true);
    setCookie({ accepted: true });
  };

  const handleDeny = () => {
    setDenied(true);
    setCookie({ denied: true });
  };

  const setCookie = (value: Partial<CookieConsent>) => {
    localStorage.setItem(COOKIE_NAME, JSON.stringify({
      ...getStoredCookie(),
      ...value,
      expiryTime: new Date().getTime() + COOKIE_EXPIRY_MINUTES * 60 * 1000,
    }));
  };

  const getStoredCookie = (): CookieConsent => {
    const storedCookie = localStorage.getItem(COOKIE_NAME);
    if (storedCookie) {
      return JSON.parse(storedCookie);
    }
    return { accepted: false, denied: false };
  };

  useEffect(() => {
    const { accepted, denied, expiryTime } = getStoredCookie();
    if (expiryTime && new Date().getTime() < expiryTime) {
      setAccepted(accepted);
      setDenied(denied);
    } else {
      // Cookie has expired, reset consent
      localStorage.removeItem(COOKIE_NAME);
    }
    setLoading(false); // Update loading state after checking consent
  }, []);

  if (loading) {
    return null; // Render nothing while checking the consent state
  }

  if (accepted || denied) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-100 text-black p-4 text-center">
      <p>
        This website uses <span className='ml-0.5 font-bold mr-0.5 hover:text-cyan-700'><a href="/cookiespolicy">cookies</a></span> to ensure you get the best experience on our website.
        By continuing to use our site, you accept our use of cookies.
      </p>
      <Button
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-2"
        onClick={handleAccept}
      >
        Accept
      </Button>
      <Button
        className="hover:bg-slate-400 hover:text-black text-black bg-white font-bold py-2 px-4 rounded ml-2 mt-2"
        onClick={handleDeny}
      >
        Deny
      </Button>
    </div>
  );
};

export default CookieConsentBanner;
