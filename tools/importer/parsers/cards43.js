/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare header row
  const rows = [['Cards (cards43)']];

  // Only select visible cards
  const cards = element.querySelectorAll(':scope > div.manually-pick-item-card.card:not([style*="display: none"])');

  cards.forEach(card => {
    // First cell: image (mandatory)
    const img = card.querySelector('img');

    // Second cell: gather all text content from .card-body and .card-footer in order
    const textParts = [];
    // card-body (may contain heading and description)
    const cardBody = card.querySelector('.card-body');
    if (cardBody) {
      Array.from(cardBody.childNodes).forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          textParts.push(node);
        } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          textParts.push(document.createTextNode(node.textContent));
        }
      });
    }
    // card-footer (CTA links)
    const cardFooter = card.querySelector('.card-footer');
    if (cardFooter) {
      // Include all links (CTAs), with icons removed
      const links = cardFooter.querySelectorAll('a');
      links.forEach(a => {
        // Remove icon spans
        a.querySelectorAll('span.icon').forEach(icon => icon.remove());
        textParts.push(a);
      });
      // If card-footer contains extra text nodes, preserve them
      Array.from(cardFooter.childNodes).forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          textParts.push(document.createTextNode(node.textContent));
        }
      });
    }
    rows.push([img, textParts]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
