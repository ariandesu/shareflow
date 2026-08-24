import { useEffect, useRef } from 'react';

export function AdBanner() {
  const desktopAdRef = useRef<HTMLDivElement>(null);
  const mobileAdRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Desktop Ad Setup (728x90)
    const desktopContainer = desktopAdRef.current;
    if (desktopContainer) {
      (window as any).atOptions = {
        'key': 'fe7cb2fec465f699a20edc2d1f421752',
        'format': 'iframe',
        'height': 90,
        'width': 728,
        'params': {},
      };

      const script = document.createElement('script');
      script.src = 'https://www.highperformanceformat.com/fe7cb2fec465f699a20edc2d1f421752/invoke.js';
      script.async = true;

      desktopContainer.appendChild(script);
    }

    // Mobile Ad Setup (320x50)
    const mobileContainer = mobileAdRef.current;
    if (mobileContainer) {
      const mobileScriptConfig = document.createElement('script');
      mobileScriptConfig.text = `
        atOptions = {
          'key': '8c7640f0c0c7f6f22a2c7af56e83c1bc',
          'format': 'iframe',
          'height': 50,
          'width': 320,
          'params': {}
        };
      `;
      const mobileScriptInvoke = document.createElement('script');
      mobileScriptInvoke.src = 'https://www.highrevenueformat.com/8c7640f0c0c7f6f22a2c7af56e83c1bc/invoke.js';
      mobileScriptInvoke.async = true;

      mobileContainer.appendChild(mobileScriptConfig);
      mobileContainer.appendChild(mobileScriptInvoke);
    }
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center my-4 overflow-hidden">
      {/* Desktop View (728x90) */}
      <div ref={desktopAdRef} className="hidden md:flex justify-center items-center min-h-[90px] w-full max-w-[728px]" />

      {/* Mobile View (320x50) */}
      <div ref={mobileAdRef} className="flex md:hidden justify-center items-center min-h-[50px] w-full max-w-[320px]" />
    </div>
  );
}
