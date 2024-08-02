"use client";
import { useEffect, useState } from "react";
import { ParsedUrlQuery } from "querystring";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "./ui/use-toast";
import { quantum, helix } from 'ldrs';

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
  const type = params.get("type");
  
  const [qrUrl, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(5); // countdown in milliseconds

  useEffect(() => {
    quantum.register();
    helix.register();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1); // interval in milliseconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (qrUrl) {
      const timeout = setTimeout(() => {
        router.replace(qrUrl);
      }, 5); // 5 milliseconds
      return () => clearTimeout(timeout);
    }
  }, [qrUrl]);

  useEffect(() => {
    if (id && type === "qr") {
      fetch(`/api/scans`, {
        method: "POST",
        body: JSON.stringify({
          type: 0,
          id,
        }),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          if (data.url) {
            toast({
              title: `You're being redirected to:`,
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
  }, []);

  useEffect(() => {
    if (!loading && qrUrl) {
      const timeout = setTimeout(() => {
        router.replace(qrUrl);
      }, countdown); // countdown in milliseconds

      return () => clearTimeout(timeout);
    }
  }, [loading, qrUrl, countdown]);

  return(
    <div className="flex flex-col relative mb-[20%] mt-[20%] left-[39%]">
      {/* <l-quantum
        size="300"
        speed="1.75" 
        color="black" 
      ></l-quantum> */}
      <l-helix
        size="300"
        speed="1.75" 
        color="black" 
      ></l-helix>
    </div>
  );
};

export default RedirectForm;
