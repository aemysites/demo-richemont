/* global WebImporter */
export default function parse(element, { document }) {
  // The header row as per the example
  const headerRow = ['Cards (cards8)'];

  // Find the main area container for the cards
  const areaContainer = element.querySelector('.umb-block-grid__area-container');
  const areas = areaContainer ? areaContainer.querySelectorAll(':scope > .umb-block-grid__area') : [];
  const cardRows = [];

  areas.forEach(area => {
    // Each area may contain a card (image inside a link)
    let imageCell = '';
    let textCell = '';
    // Look for an image card block
    const imgBlock = area.querySelector('.image-block');
    if (imgBlock) {
      // Use the anchor (with image inside) if present, else just the img
      const anchor = imgBlock.querySelector('a');
      if (anchor) {
        imageCell = anchor;
      } else {
        const img = imgBlock.querySelector('img');
        if (img) imageCell = img;
      }
      // Try to extract the card title from the alt text (as <strong>) and any visible non-image, non-link text inside the block
      const img = imgBlock.querySelector('img');
      let pieces = [];
      if (img && img.alt && img.alt.trim()) {
        const strong = document.createElement('strong');
        strong.textContent = img.alt.trim();
        pieces.push(strong);
      }
      // Extract any text that is NOT inside the anchor or img
      // This ensures we grab visible content if present in future HTMLs
      Array.from(imgBlock.childNodes).forEach(node => {
        // Exclude anchor and image nodes
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.tagName !== 'A' && node.tagName !== 'IMG') {
            pieces.push(node);
          }
        } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          // Visible text node
          const span = document.createElement('span');
          span.textContent = node.textContent.trim();
          pieces.push(span);
        }
      });
      // If there's only a <strong>, just use it, otherwise use all found pieces
      textCell = pieces.length === 1 ? pieces[0] : pieces.length > 1 ? pieces : '';
    }
    cardRows.push([imageCell, textCell]);
  });

  const cells = [headerRow, ...cardRows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
