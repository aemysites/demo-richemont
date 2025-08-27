/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as in example
  const headerRow = ['Cards (cards35)'];
  const rows = [];

  // Select all direct <a> child cards that are visible (not display: none)
  const cards = Array.from(element.children).filter(card => {
    return card.tagName === 'A' && card.style.display !== 'none';
  });

  cards.forEach(card => {
    // First column: reference image element directly
    const img = card.querySelector('img');

    // Second column: reference all child nodes of .card-body (to not miss any text)
    const cardBody = card.querySelector('.card-body');
    let textCell;
    if (cardBody) {
      // Create a fragment to hold all children, preserving existing elements
      const fragment = document.createDocumentFragment();
      Array.from(cardBody.childNodes).forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim())) {
          fragment.appendChild(node);
        }
      });
      textCell = fragment.childNodes.length === 1 ? fragment.firstChild : Array.from(fragment.childNodes);
    } else {
      textCell = '';
    }
    rows.push([img, textCell]);
  });

  // Compose final table data
  const tableData = [headerRow, ...rows];

  // Create the block table and replace original element
  const block = WebImporter.DOMUtils.createTable(tableData, document);
  element.replaceWith(block);
}
