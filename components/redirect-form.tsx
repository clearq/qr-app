'use client'
import { useEffect, useState } from 'react';
import { ParsedUrlQuery } from 'querystring';
import { Progress } from '@/components/ui/progress';

interface RedirectProps {
  url: string;
}

interface Params extends ParsedUrlQuery {
  qrId: string;
}

const RedirectForm = ({ url }: RedirectProps) => {
  const [countdown, setCountdown] = useState(5);
  const [progress, setProgress] = useState(75)

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(prevCountdown => prevCountdown - 1);
    }, 1000);

    const timeout = setTimeout(() => {
      window.location.href = url;
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [url]);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(99), 4000)
    return () => clearTimeout(timer)
  }, [])


  return (
    <div className="flex mr-9 ml-9 flex-col items-center justify-center min-h-screen">
      <h1>Redirecting in {countdown} seconds...</h1>
      <Progress value={progress} className="w-[60%]" />
    </div>
  );
};

export default RedirectForm;
