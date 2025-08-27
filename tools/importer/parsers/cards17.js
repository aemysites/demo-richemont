/* global WebImporter */
export default function parse(element, { document }) {
  // Table header from example
  const headerRow = ['Cards (cards17)'];

  // Get all card containers in order
  const areaContainers = element.querySelectorAll('.umb-block-grid__area');
  const rows = [];

  areaContainers.forEach((area) => {
    const cardBlock = area.querySelector('.history-card-block.card');
    if (!cardBlock) return;
    const img = cardBlock.querySelector('img');
    const body = cardBlock.querySelector('.card-body');

    // Gather all child nodes of card body in order for text content
    const textElements = [];
    if (body) {
      Array.from(body.childNodes).forEach(node => {
        // If node is an element and not empty
        if (node.nodeType === 1 && node.textContent.trim()) {
          textElements.push(node);
        }
        // If node is a non-empty text node (for safety, wrap in <p>)
        if (node.nodeType === 3 && node.textContent.trim()) {
          const p = document.createElement('p');
          p.textContent = node.textContent.trim();
          textElements.push(p);
        }
      });
    }
    rows.push([img, textElements]);
  });

  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
