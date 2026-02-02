import { useEffect, useState } from 'react';

const InAppRedirect = () => {
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    const isMobile = window.innerWidth < 768;
    const isInApp = /fbav|fban|fbios|instagram/.test(ua);

    if (isMobile && isInApp) {
      setShouldShow(true);

      // ✅ iOS Safari deep linking trick
      setTimeout(() => {
        window.location.href = "https://aishaquran.com"; // replace with your site or current page
      }, 100);
    }
  }, []);

  if (!shouldShow) return null;

  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center text-center px-4 z-50">
      <div>
        <h2 className="text-xl font-bold mb-2 text-gray-800">⚠️ Please open this in your browser</h2>
        <p className="text-gray-600 mb-4">You're using an in-app browser that may not support this form.</p>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => window.open(window.location.href, '_blank')}
        >
          Open in Safari/Chrome
        </button>
      </div>
    </div>
  );
};

export default InAppRedirect;
