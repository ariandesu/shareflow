export function AdBanner() {
  const desktopSrcDoc = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        html, body { margin: 0; padding: 0; overflow: hidden; background: transparent; display: flex; justify-content: center; align-items: center; width: 100%; height: 100%; }
      </style>
    </head>
    <body>
      <script type="text/javascript">
        atOptions = {
          'key': 'fe7cb2fec465f699a20edc2d1f421752',
          'format': 'iframe',
          'height': 90,
          'width': 728,
          'params': {}
        };
      </script>
      <script type="text/javascript" src="https://www.highperformanceformat.com/fe7cb2fec465f699a20edc2d1f421752/invoke.js"></script>
    </body>
    </html>
  `;

  const mobileSrcDoc = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        html, body { margin: 0; padding: 0; overflow: hidden; background: transparent; display: flex; justify-content: center; align-items: center; width: 100%; height: 100%; }
      </style>
    </head>
    <body>
      <script type="text/javascript">
        atOptions = {
          'key': '8c7640f0c0c7f6f22a2c7af56e83c1bc',
          'format': 'iframe',
          'height': 50,
          'width': 320,
          'params': {}
        };
      </script>
      <script type="text/javascript" src="https://www.highrevenueformat.com/8c7640f0c0c7f6f22a2c7af56e83c1bc/invoke.js"></script>
    </body>
    </html>
  `;

  return (
    <div className="w-full flex flex-col items-center justify-center my-4 px-2 overflow-hidden min-h-[50px] md:min-h-[90px]">
      {/* Desktop View (728x90) */}
      <div className="hidden md:flex justify-center items-center w-[728px] h-[90px] overflow-hidden">
        <iframe
          srcDoc={desktopSrcDoc}
          title="Adsterra Desktop Banner"
          width="728"
          height="90"
          className="border-0 overflow-hidden"
          scrolling="no"
        />
      </div>

      {/* Mobile View (320x50) */}
      <div className="flex md:hidden justify-center items-center w-[320px] h-[50px] overflow-hidden">
        <iframe
          srcDoc={mobileSrcDoc}
          title="Adsterra Mobile Banner"
          width="320"
          height="50"
          className="border-0 overflow-hidden"
          scrolling="no"
        />
      </div>
    </div>
  );
}
