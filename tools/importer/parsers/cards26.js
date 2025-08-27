/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare header row: must be a single-column row
  const cells = [
    ['Cards (cards26)']
  ];

  // Prepare the card data row: two columns
  // Left column: image/icon, none present, so use empty string
  const imageCell = '';

  // Right column: all card text content
  const content = document.createDocumentFragment();

  const date = element.querySelector('.clndr-date');
  if (date && date.textContent.trim()) {
    const dateP = document.createElement('p');
    dateP.textContent = date.textContent.trim();
    content.appendChild(dateP);
  }

  const title = element.querySelector('.clndr-title');
  if (title && title.textContent.trim()) {
    const h2 = document.createElement('h2');
    h2.textContent = title.textContent.trim();
    content.appendChild(h2);
  }

  const time = element.querySelector('.clndr-time');
  if (time && time.textContent.trim()) {
    const timeP = document.createElement('p');
    timeP.textContent = time.textContent.trim();
    content.appendChild(timeP);
  }

  const button = element.querySelector('.calendar-add');
  if (button && button.textContent.trim()) {
    content.appendChild(button);
  }

  // Data row: two columns
  cells.push([imageCell, content]);

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
