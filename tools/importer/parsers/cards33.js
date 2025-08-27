/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: block name as a single cell
  const cells = [['Cards (cards33)']];

  // Find the image (img tag)
  const img = element.querySelector('img');

  // Find the main text content: any <p> under element (description/credit)
  const pList = Array.from(element.querySelectorAll('p')).filter(p => p.textContent.trim());

  // Always reference existing elements, not clones
  let textCell = '';
  if (pList.length === 1) {
    textCell = pList[0];
  } else if (pList.length > 1) {
    textCell = pList;
  }

  // Only add card row if there's content
  if (img || textCell) {
    cells.push([img || '', textCell || '']);
  }

  // Build table and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
