import React, { useEffect, useRef, useState } from 'react';

const EmbedNajdForm = () => {
  const formRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const injectScript = () => {
      const script = document.createElement('script');
      script.src = 'https://link.najddigital.com/js/form_embed.js';
      script.async = true;
      script.onload = () => console.log('Najd form script loaded');

      if (formRef.current instanceof Node) {
        formRef.current.appendChild(script);
      } else {
        console.warn('formRef is not a valid DOM node');
      }
    };

    const timer = setTimeout(() => {
      if (formRef.current) {
        injectScript();
      } else {
        console.warn('formRef not ready for script injection');
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleIframeLoad = () => {
    console.log('Iframe loaded');
    setIsLoaded(true);
  };

  return (
    <div ref={formRef} className="w-full min-h-[847px] relative">
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-opacity-75"></div>
        </div>
      )}

      <iframe
        src="https://link.najddigital.com/widget/form/S7HaN54WBMf7M68rnXb4"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          borderRadius: '3px',
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.5s ease-in-out',
        }}
        id="inline-S7HaN54WBMf7M68rnXb4"
        data-layout='{"id":"INLINE"}'
        data-trigger-type="alwaysShow"
        data-activation-type="alwaysActivated"
        data-deactivation-type="neverDeactivate"
        data-form-name="Aisha Quran Academy Free Trial Reg"
        data-height="847"
        data-layout-iframe-id="inline-S7HaN54WBMf7M68rnXb4"
        data-form-id="S7HaN54WBMf7M68rnXb4"
        title="Aisha Quran Academy Free Trial Reg"
        onLoad={handleIframeLoad}
      />
    </div>
  );
};

export default EmbedNajdForm;
