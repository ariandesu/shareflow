import { useEffect, useRef } from 'react';

export function AdBanner() {
  const desktopAdRef = useRef<HTMLDivElement>(null);
  const mobileAdRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Desktop Ad Setup (728x90) - Key: fe7cb2fec465f699a20edc2d1f421752
    const desktopContainer = desktopAdRef.current;
    if (desktopContainer && desktopContainer.children.length === 0) {
      const desktopScriptConfig = document.createElement('script');
      desktopScriptConfig.text = `
        atOptions = {
          'key': 'fe7cb2fec465f699a20edc2d1f421752',
          'format': 'iframe',
          'height': 90,
          'width': 728,
          'params': {}
        };
      `;
      const desktopScriptInvoke = document.createElement('script');
      desktopScriptInvoke.src = 'https://www.highperformanceformat.com/fe7cb2fec465f699a20edc2d1f421752/invoke.js';
      desktopScriptInvoke.async = true;

      desktopContainer.appendChild(desktopScriptConfig);
      desktopContainer.appendChild(desktopScriptInvoke);
    }

    // Mobile Ad Setup (320x50) - Key: 8c7640f0c0c7f6f22a2c7af56e83c1bc
    const mobileContainer = mobileAdRef.current;
    if (mobileContainer && mobileContainer.children.length === 0) {
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
    <div className="w-full flex flex-col items-center justify-center my-4 px-2 overflow-hidden">
      {/* Desktop View (728x90) */}
      <div ref={desktopAdRef} className="hidden md:flex justify-center items-center min-h-[90px] w-full max-w-[728px] overflow-hidden" />

      {/* Mobile View (320x50) */}
      <div ref={mobileAdRef} className="flex md:hidden justify-center items-center min-h-[50px] w-full max-w-[320px] overflow-hidden" />
    </div>
  );
}
