/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid container for the two columns
  const gridContainer = element.querySelector('.grid-container.grid-container--twoXtwo');
  if (!gridContainer) return;

  // Select the two column areas (left and right)
  const areas = gridContainer.querySelectorAll(':scope > .umb-block-grid__area-container > .umb-block-grid__area');

  if (!areas || areas.length !== 2) return;

  // For each area, extract the content for the cell (use layout-container for resilience)
  const cellElements = Array.from(areas).map(area => {
    const layoutContainer = area.querySelector(':scope > .umb-block-grid__layout-container');
    return layoutContainer ? layoutContainer : document.createTextNode('');
  });

  // The header row must have a single cell (not spanning columns)
  const cells = [
    ['Columns block (columns41)'],
    cellElements
  ];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element with the new table
  element.replaceWith(table);
}
