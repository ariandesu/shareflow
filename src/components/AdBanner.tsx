import { useEffect, useRef } from 'react';

export function AdBanner() {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = adRef.current;
    if (!container) return;

    (window as any).atOptions = {
      'key': 'fe7cb2fec465f699a20edc2d1f421752',
      'format': 'iframe',
      'height': 90,
      'width': 728,
      'params': {},
    };

    const script = document.createElement('script');
    script.src = 'https://www.highperformanceformat.com/fe7cb2fec465f699a20edc2d1f421752/invoke.js';
    container.appendChild(script);

    return () => {
      container.removeChild(script);
    };
  }, []);

  return <div ref={adRef} className="flex justify-center" />;
}