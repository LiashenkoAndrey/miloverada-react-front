import {useEffect} from "react";

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

const useGoogleAnalytics = (trackingId: string) => {
  useEffect(() => {
    // Load gtag script
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = (...args: any[]) => {
      window.dataLayer.push(args);
    };

    window.gtag("js", new Date());
    window.gtag("config", trackingId);

    return () => {
      document.head.removeChild(script);
    };
  }, [trackingId]);
};

export default useGoogleAnalytics;
