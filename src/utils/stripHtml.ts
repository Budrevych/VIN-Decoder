/**
 * Safely strips HTML tags from a text string without using dangerouslySetInnerHTML
 * to prevent XSS vulnerabilities when displaying variable descriptions from NHTSA API.
 */
export const stripHtml = (html: string): string => {
  if (!html) return '';
  const tmp = document.createElement('DIV');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};
