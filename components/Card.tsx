'use client'
import React, { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';

interface CardProps {
  isRounded: boolean;
  stamps: number;
  firstName: string;
  lastName: string;
  backgroundColor: string;
  textColor: string;
}

const Card: React.FC<CardProps> = ({ isRounded, stamps, firstName, lastName, backgroundColor, textColor }) => {
  const cardClass = isRounded ? 'rounded-lg' : 'border';
  const barcodeRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (barcodeRef.current) {
      JsBarcode(barcodeRef.current, generateRandomBarcode(), {
        format: "CODE128",
        lineColor: "#000",
        width: 2,
        height: 50,
        displayValue: false
      });
    }
  }, [firstName, lastName, stamps]);

  const generateRandomBarcode = (): string => {
    return Math.random().toString(36).substring(2, 12).toUpperCase();
  }

  return (
    <div className={`p-6 max-w-sm mx-auto ${cardClass} shadow-md flex flex-col items-center space-y-4`} style={{ backgroundColor, color: textColor }}>
      <div>
        <div className="text-xl font-medium">{firstName} {lastName}</div>
        <p>Stamps: {stamps}</p>
      </div>
      <svg ref={barcodeRef}></svg>
    </div>
  );
};

export default Card;
