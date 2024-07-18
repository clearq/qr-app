import React from 'react';
import { useRouter } from 'next/router';
// import { QrReader } from 'react-qr-reader';
import { Scanner } from '@yudiel/react-qr-scanner';

const QrScanner = () => {
  const router = useRouter();

  const handleScan = async (data: string | null) => {
    if (data) {
      try {
        const response = await fetch('/api/registerScan', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            qrId: data,
            ipAddress: '192.168.1.1', // Get the actual IP address dynamically
            latitude: 37.7749, // Get the actual latitude dynamically
            longitude: -122.4194, // Get the actual longitude dynamically
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to register scan');
        }

        const result = await response.json();
        console.log('Scan registered:', result);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleError = (err: any) => {
    console.error(err);
  };

  return (
    <div>
      {/* <QrReader
        onResult={(result, error) => {
          if (!!result) {
            handleScan(result?.text);
          }

          if (!!error) {
            handleError(error);
          }
        }}
        style={{ width: '100%' }}
      /> */}

<Scanner onScan={(result) => console.log(result)} />
    </div>
  );
};

export default QrScanner;
