/* global WebImporter */
export default function parse(element, { document }) {
  // Table header exactly as in the example
  const headerRow = ['Cards (cards5)'];

  // Find all visible cards
  const cards = Array.from(element.querySelectorAll('.manually-pick-item-card.card')).filter(card => card.style.display !== 'none');

  // Build rows for each card
  const rows = cards.map(card => {
    // First cell: the image element (reference existing element)
    const img = card.querySelector('img');
    
    // Second cell: all text content in .card-body, preserving tags and structure
    const cardBody = card.querySelector('.card-body');
    // If cardBody exists, create a <div> and append all children (preserves headings, paragraphs, etc.)
    let allTextContent;
    if (cardBody) {
      // Reference all child nodes (including text nodes for whitespace)
      const div = document.createElement('div');
      Array.from(cardBody.childNodes).forEach(node => {
        // Only append if element or non-empty text node
        if (node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim())) {
          div.appendChild(node);
        }
      });
      allTextContent = div;
    } else {
      allTextContent = '';
    }
    return [img, allTextContent];
  });

  // Create the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);
  // Replace the original element
  element.replaceWith(table);
}
