/* global WebImporter */
export default function parse(element, { document }) {
  // The header row must be a single cell, per requirements
  const headerRow = ['Columns block (columns9)'];

  // Get the grid container
  const gridContainer = element.querySelector('.grid-container');
  if (!gridContainer) return;

  // Get the two areas (columns)
  const areas = gridContainer.querySelectorAll(':scope > .umb-block-grid__area-container > .umb-block-grid__area');
  if (areas.length < 2) return;

  // Helper to extract all direct content blocks from a column
  function getColumnContent(area) {
    const layoutItems = area.querySelectorAll(':scope > .umb-block-grid__layout-container > .umb-block-grid__layout-item');
    const blocks = [];
    layoutItems.forEach((item) => {
      const block = item.querySelector(
        '.internal-video-block, .headline-block, .richtext-block'
      );
      if (block) {
        blocks.push(block);
      }
    });
    if (blocks.length === 0) return '';
    if (blocks.length === 1) return blocks[0];
    return blocks;
  }

  // Content row: must be a single row with two columns
  const contentRow = [getColumnContent(areas[0]), getColumnContent(areas[1])];

  // Compose rows array for createTable: header row (1 cell), then content row (2 cells)
  const rows = [headerRow, contentRow];

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
