/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: a single cell/column with the block name
  const headerRow = ['Columns block (columns13)'];

  // Get the main grid container for the columns
  const gridContainer = element.querySelector('.grid-container--fourXfourXfour');
  if (!gridContainer) return;

  // Find all column areas (left, middle, right) in order
  const areaContainers = gridContainer.querySelectorAll(':scope > .umb-block-grid__area-container > .umb-block-grid__area');
  if (!areaContainers.length) return;

  // For each column area, get its .card content block
  const columns = Array.from(areaContainers).map(area => {
    const card = area.querySelector(':scope > .umb-block-grid__layout-container > .umb-block-grid__layout-item > .card');
    return card || document.createTextNode('');
  });

  // Build the table: header row (1 cell), then one row with all columns
  const rows = [headerRow, columns];
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
