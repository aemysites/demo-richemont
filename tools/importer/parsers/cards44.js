/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as per example
  const headerRow = ['Cards (cards44)'];
  const rows = [headerRow];

  // Only visible cards (not display:none)
  const cards = Array.from(element.querySelectorAll('.document-card-block.card'))
    .filter(card => card.style.display !== 'none');

  cards.forEach(card => {
    // First column: image
    const img = card.querySelector('img');

    // Second column: All text content (type, title, download link) as per HTML structure
    const cellContent = [];

    // Get card type (p.document-card-block__type)
    const cardBody = card.querySelector('.card-body');
    if (cardBody) {
      const type = cardBody.querySelector('.document-card-block__type');
      if (type && type.textContent.trim()) {
        // Keep element reference
        cellContent.push(type);
      }
      // Get card title - as heading element
      const title = cardBody.querySelector('.card-title');
      if (title && title.textContent.trim()) {
        cellContent.push(title);
      }
    }
    // Download link (from card-footer)
    const cardFooter = card.querySelector('.card-footer');
    if (cardFooter) {
      // There may be extra spans for icons, keep only the link text
      const link = cardFooter.querySelector('a');
      if (link) {
        // Remove any icons, keep only text "Download"
        const text = Array.from(link.childNodes)
          .filter(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim())
          .map(n => n.textContent.trim())
          .join(' ');
        if (text) {
          // For semantic structure, make a new <a> with text and same href
          const a = document.createElement('a');
          a.href = link.href;
          a.textContent = text;
          if (link.target) a.target = link.target;
          cellContent.push(a);
        }
      }
    }

    rows.push([
      img,
      cellContent
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
