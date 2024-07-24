"use client";
import { useEffect, useState } from "react";
import { ParsedUrlQuery } from "querystring";
import { Progress } from "@/components/ui/progress";
import { useRouter, useSearchParams } from "next/navigation";
import { CardHeader } from "./ui/card";
import { toast } from "./ui/use-toast";

interface RedirectProps {
  url: string;
}

interface Params extends ParsedUrlQuery {
  qrId: string;
}

const RedirectForm = () => {
  const params = useSearchParams();
  const router = useRouter();
  const id = params.get("id");
  const [qrUrl, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(1);
  const [progress, setProgress] = useState(75);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (qrUrl) {
      const timeout = setTimeout(() => {
        router.replace(qrUrl)
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, [qrUrl]);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(99), 4000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (id) {
      fetch(`/api/qr/${id}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          if (data.url) {
            toast({
              title: `Your being redirected to:`,
              description: `${data.url}`,
            });
            setUrl(data.url);
          } else {
            console.error("Error fetching URL:", data.error);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching QR code data:", err);
          setLoading(false);
        });
    } else {
      console.error("No id found in search params.");
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!loading && qrUrl) {
      const timeout = setTimeout(() => {
        router.replace(qrUrl)
      }, countdown * 1000);

      return () => clearTimeout(timeout);
    }
  }, [loading, qrUrl, countdown]);

  if (loading) {
    return (
      <div className="flex mr-9 ml-9 flex-col items-center justify-center min-h-screen">
        <h1>Redirecting in {countdown} seconds...</h1>
        <Progress className="text-center" value={progress} />
      </div>
    );
  }

  if (!qrUrl) {
    return (
      <div className="flex mr-9 ml-9 justify-center items-center h-screen">
        <CardHeader>Error: URL not found</CardHeader>
      </div>
    );
  }

  return null;
};

export default RedirectForm;
