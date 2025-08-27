/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards4) header row
  const headerRow = ['Cards (cards4)'];

  // Only visible cards (display:none are not shown)
  const cards = Array.from(element.children).filter(card => {
    const style = card.getAttribute('style');
    return !(style && style.includes('display: none'));
  });

  const rows = cards.map(card => {
    // First cell: Image/Icon (mandatory)
    const img = card.querySelector('img');

    // Second cell: All content from .card-body (including all text, headings, etc)
    // plus any footer link(s)
    const contents = [];
    const cardBody = card.querySelector('.card-body');

    if (cardBody) {
      // Gather all child nodes in card-body (including text nodes and element nodes)
      cardBody.childNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          contents.push(node);
        } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          // preserve text content as <p>
          const p = document.createElement('p');
          p.textContent = node.textContent.trim();
          contents.push(p);
        }
      });
    }

    // Add CTA/link from card-footer if present
    const cardFooter = card.querySelector('.card-footer');
    if (cardFooter) {
      // Use the existing anchor element, but remove any icon span
      const link = cardFooter.querySelector('a');
      if (link) {
        const icon = link.querySelector('.icon');
        if (icon) icon.remove();
        contents.push(link);
      }
    }

    // Always ensure second cell is not empty
    if (contents.length === 0) contents.push('');

    return [img, contents];
  });

  // Compose the full table as required
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
