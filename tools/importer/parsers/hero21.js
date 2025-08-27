/* global WebImporter */
export default function parse(element, { document }) {
  // Find the heroBlock container within the element
  const heroBlock = element.querySelector('.hero-block');
  if (!heroBlock) return;

  // --- Background asset (video as link) ---
  let backgroundAsset = '';
  // Find the first visible <video> source (desktop preferred, then mobile)
  let videoEl = heroBlock.querySelector('video.d-none.d-md-block source')
    || heroBlock.querySelector('video.d-block.d-md-none source')
    || heroBlock.querySelector('video source');
  if (videoEl && videoEl.getAttribute('src')) {
    const src = videoEl.getAttribute('src');
    const link = document.createElement('a');
    link.href = src;
    link.textContent = src;
    backgroundAsset = link;
  }

  // --- Gather all visible content (headings, paragraphs, plus extras) ---
  // Collect headings, paragraphs, and direct links in heroBlock
  const contentElements = [];
  // Headings
  heroBlock.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(el => contentElements.push(el));
  // Paragraphs
  heroBlock.querySelectorAll('p').forEach(el => contentElements.push(el));
  // Standalone links/buttons (if any)
  heroBlock.querySelectorAll('a').forEach(el => {
    // Only add links not inside a heading or p
    if (!el.closest('h1, h2, h3, h4, h5, h6, p')) contentElements.push(el);
  });
  // Include any other direct children in heroBlock with text nodes
  Array.from(heroBlock.children).forEach(child => {
    // If not already included and it contains visible text
    if (!contentElements.includes(child)) {
      // If the child contains text and is not script/style
      if (child.nodeType === Node.ELEMENT_NODE && child.textContent.trim() && child.tagName !== 'SCRIPT' && child.tagName !== 'STYLE') {
        contentElements.push(child);
      }
    }
  });

  // If no content elements are found, use the whole heroBlock as fallback (shouldn't happen)
  const contentRow = contentElements.length ? contentElements : heroBlock;

  // Compose the table rows as per the spec (header, background, content)
  const rows = [
    ['Hero'], // Header row matches example
    [backgroundAsset],
    [contentRow],
  ];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
