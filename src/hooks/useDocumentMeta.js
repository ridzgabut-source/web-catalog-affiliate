import { useEffect } from 'react';

/**
 * Hook to dynamically update document title and social Open Graph / Twitter Card meta tags
 */
export function useDocumentMeta({
  title,
  description,
  image,
  type = 'website',
}) {
  useEffect(() => {
    // 1. Update Title
    const originalTitle = document.title;
    if (title) {
      document.title = `${title} — KoleksiKita`;
    }

    // Helper to set meta tags
    const setMetaTag = (selector, attributeName, content) => {
      if (!content) return;
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        
        // Safely extract attribute and value from selector like 'meta[property="og:title"]'
        const splitIndex = selector.indexOf('=');
        if (splitIndex !== -1) {
          const attr = selector.substring(0, splitIndex).replace(/meta\[/, '').trim();
          const val = selector.substring(splitIndex + 1).replace(/[\]"]/g, '').trim();
          element.setAttribute(attr, val);
        }
        
        document.head.appendChild(element);
      }
      element.setAttribute(attributeName, content);
    };

    // 2. Open Graph Tags
    if (title) setMetaTag('meta[property="og:title"]', 'content', `${title} — KoleksiKita`);
    if (description) setMetaTag('meta[property="og:description"]', 'content', description);
    if (image) setMetaTag('meta[property="og:image"]', 'content', image);
    if (type) setMetaTag('meta[property="og:type"]', 'content', type);

    // 3. Twitter Card Tags
    if (title) setMetaTag('meta[name="twitter:title"]', 'content', `${title} — KoleksiKita`);
    if (description) setMetaTag('meta[name="twitter:description"]', 'content', description);
    if (image) setMetaTag('meta[name="twitter:image"]', 'content', image);

    return () => {
      document.title = originalTitle;
    };
  }, [title, description, image, type]);
}
