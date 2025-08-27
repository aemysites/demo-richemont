/* global WebImporter */
export default function parse(element, { document }) {
  // Find all contentful columns (figure-block)
  const areaContainers = element.querySelectorAll('.umb-block-grid__area');
  const columns = [];
  areaContainers.forEach(area => {
    const figure = area.querySelector('.figure-block');
    if (figure && figure.textContent.trim().length > 0) {
      columns.push(figure);
    }
  });

  // Match the example: always two columns for this layout, fill with empty strings if needed
  while (columns.length < 2) {
    columns.push('');
  }

  // The header row must be a single cell, regardless of number of columns in second row
  const tableRows = [
    ['Columns block (columns37)'],
    columns
  ];

  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
