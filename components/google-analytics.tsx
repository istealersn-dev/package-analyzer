'use client';

import Script from 'next/script';

const GA_MEASUREMENT_ID = 'G-26TGK0XB0R';

export default function GoogleAnalytics() {
  const handleGALoaded = () => {
    console.log('Google Analytics loaded');
    // Send a test event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'test_event', {
        'event_category': 'test',
        'event_label': 'GA4 Test Event'
      });
    }
  };

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
        onLoad={handleGALoaded}
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
}
