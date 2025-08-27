/* global WebImporter */
export default function parse(element, { document }) {
  // The header row must be exactly one cell, even if there are multiple columns in the content row
  const headerRow = ['Columns block (columns45)'];

  // Find all column areas (left, middle, right)
  const gridContainer = element.querySelector('.grid-container');
  const areas = gridContainer.querySelectorAll('.umb-block-grid__area');

  // For the content row, collect each area's content (image-block)
  const columns = [];
  areas.forEach((area) => {
    const layoutContainer = area.querySelector('.umb-block-grid__layout-container');
    let cellContent = '';
    if (layoutContainer) {
      // Use all child nodes of the layoutContainer (should be 1 in this HTML)
      // We want to reference the existing image block element if present
      const imageBlock = layoutContainer.querySelector('.image-block');
      if (imageBlock) {
        cellContent = imageBlock;
      }
    }
    columns.push(cellContent);
  });

  // Compose the table: first row is exactly one header cell, second row is N columns
  const cells = [headerRow, columns];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new block table
  element.replaceWith(block);
}