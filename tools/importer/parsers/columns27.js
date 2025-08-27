/* global WebImporter */
export default function parse(element, { document }) {
  // The correct structure per the example is:
  // Header row (one column) then two data rows, each with three columns (matching screenshot and HTML structure).

  // 1. Header row
  const headerRow = ['Columns block (columns27)'];

  // 2. Find the main grid container
  const gridContainer = element.querySelector('.grid-container--fourXfourXfour');
  if (!gridContainer) return;

  // 3. Find the three area containers (left, middle, right)
  const areaContainers = gridContainer.querySelectorAll('.umb-block-grid__area');
  if (areaContainers.length !== 3) return;

  // 4. Each area has two figure blocks: top and bottom
  // We'll extract each row (top and bottom) as arrays of three elements
  const row1 = [];
  const row2 = [];

  areaContainers.forEach((area) => {
    // Get all figure-blocks in this area
    const figureBlocks = area.querySelectorAll('.figure-block');
    // First is top row, second is bottom row
    if (figureBlocks.length > 0) row1.push(figureBlocks[0]);
    if (figureBlocks.length > 1) row2.push(figureBlocks[1]);
  });

  // Defensive: always 3 columns per row
  while (row1.length < 3) row1.push('');
  while (row2.length < 3) row2.push('');

  // 5. Create the table
  const cells = [headerRow, row1, row2];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // 6. Replace the original element with the table
  element.replaceWith(block);
}
