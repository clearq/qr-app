/* eslint-disable @next/next/next-script-for-ga */
"use client";
import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import "@/components/ui/card";
import DotPattern from "@/components/magicui/dot-pattern";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function Home() {
  const [authenticated, setAuthenticated] = useState(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/profile");
        if (response.ok) {
          const userData = await response.json();
          setAuthenticated(!userData.error);
        } else {
          console.error("Failed to fetch user data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <Head>
        {/* Essential Meta Tags */}
        <title>
          Qaaf - The Ultimate QR Code Generator | Free, Branded & Trackable
        </title>
        <meta
          name="description"
          content="Create, customize, and track powerful QR codes instantly. Perfect for businesses, events, research, and marketing. 100% free with no limits!"
        />
        <meta
          name="keywords"
          content="QR code generator, free QR codes, QR tracking, custom QR codes, business QR codes, dynamic QR, marketing QR codes, scan analytics, vCard QR, event QR, smart QR codes, NFC tags, QR for social media, interactive QR, product QR, QR authentication, QR menu, QR WiFi, QR e-commerce"
        />
        <meta name="author" content="Qaaf Team" />
        <meta name="robots" content="index, follow" />
        <meta name="theme-color" content="#D4AF37" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />

        {/* Open Graph / Social Media Tags */}
        <meta
          property="og:title"
          content="Qaaf - Free QR Code Generator | Branded & Trackable"
        />
        <meta
          property="og:description"
          content="Instantly generate QR codes with tracking, analytics, and customization. Grow your business, boost engagement, and get unlimited access for free!"
        />
        <meta property="og:image" content="/image/QaafGold.png" />
        <meta property="og:image:alt" content="Qaaf QR Code Generator Logo" />
        <meta property="og:url" content="https://qrgen.clearq.se" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Qaaf" />

        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Qaaf - Smart QR Code Generator for Business & Marketing"
        />
        <meta
          name="twitter:description"
          content="Create branded QR codes, track engagement, and supercharge your marketing. Get started for free today!"
        />
        <meta name="twitter:image" content="/image/QaafGold.png" />
        <meta name="twitter:site" content="@qaafqr" />

        {/* Mobile Optimization */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="Qaaf QR Generator" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <link rel="apple-touch-icon" href="/image/QaafGold.png" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href="https://qrgen.clearq.se" />

        {/* Google Analytics */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XXXXXXXXXX', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />

        {/* Facebook Pixel */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window,document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', 'XXXXXXXXXXXXXXX'); 
              fbq('track', 'PageView');
            `,
          }}
        />

        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-XXXXXXXX');
            `,
          }}
        />
      </Head>

      <div className="flex flex-col">
        <main className="flex-grow">
          <DotPattern
            className={cn(
              "fixed inset-0 -z-10 [mask-image:radial-gradient(3000px_circle_at_center,white,transparent)]"
            )}
          />
          <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center justify-center">
            {/* Logo Section */}
            <div className="w-full lg:w-1/2 flex justify-center lg:justify-end p-4">
              <Link href="/">
                <Image
                  alt="Qaaf"
                  src="/image/QaafGold.png"
                  width={150}
                  height={150}
                  className="w-full max-w-[70px] sm:max-w-[150px]"
                  priority
                />
              </Link>
            </div>

            {/* Text Section */}
            <div className="w-full lg:w-1/2 text-center lg:text-left z-50 p-4">
              <h1 className="text-[#D4AF37] text-4xl lg:text-5xl font-bold mb-5">
                Instantly Generate & Track QR Codes
              </h1>
              <p className="text-lg lg:text-xl text-gray-300 max-w-[85%] mx-auto lg:mx-0 leading-relaxed">
                Create branded QR codes that last forever. Track scans, boost
                engagement, and unlock powerful insights – all in seconds.
              </p>
              <p className="text-lg lg:text-xl text-gray-300 max-w-[85%] mx-auto lg:mx-0 leading-relaxed mt-4">
                No limits. No hidden fees. Just smarter sharing.
              </p>
              <div className="mt-6 space-x-4 space-y-4 lg:space-y-0">
                {authenticated ? (
                  <Link href="/all">
                    <Button className="bg-[#D4AF37] hover:bg-[#937100] py-3 px-6">
                      Go to Dashboard <span className="ml-2">→</span>
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/register">
                      <Button className="bg-[#D4AF37] hover:bg-[#937100] py-3 px-6">
                        Get Started
                      </Button>
                    </Link>
                    <Link href="/login">
                      <Button className="py-3 px-6">Sign In</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
