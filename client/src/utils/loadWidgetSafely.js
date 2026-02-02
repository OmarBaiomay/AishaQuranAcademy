export const loadWidgetSafely = ({ src, attributes = {}, blockInAppBrowsers = true, blockOnMobile = false }) => {
    const isInAppBrowser = /FBAN|FBAV|Instagram|Messenger/.test(navigator.userAgent);
    const isMobile = window.innerWidth < 768;
  
    if ((blockInAppBrowsers && isInAppBrowser) || (blockOnMobile && isMobile)) {
      console.warn(`[WidgetLoader] Skipped script: ${src}`);
      return null;
    }
  
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
  
    Object.entries(attributes).forEach(([key, value]) => {
      script.setAttribute(key, value);
    });
  
    document.body.appendChild(script);
    return script;
  };
  