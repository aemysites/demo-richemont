/* global WebImporter */
export default function parse(element, { document }) {
  // Find the area container holding the columns
  const areaContainer = element.querySelector('.umb-block-grid__area-container');
  let columns = [];

  if (areaContainer) {
    // Get all direct area children (should be 3, but handle flexible count)
    const areas = areaContainer.querySelectorAll(':scope > .umb-block-grid__area');
    columns = Array.from(areas).map(area => {
      // Each area contains a .umb-block-grid__layout-container > .umb-block-grid__layout-item (the content block)
      const layoutContainer = area.querySelector(':scope > .umb-block-grid__layout-container');
      if (layoutContainer) {
        const items = Array.from(layoutContainer.children).filter(child => child.classList.contains('umb-block-grid__layout-item'));
        if (items.length === 1) {
          return items[0];
        } else if (items.length > 1) {
          return items;
        }
      }
      // fallback: empty string for empty column
      return '';
    });
  }

  // The header row must have a single cell, matching the example exactly
  const headerRow = ['Columns block (columns14)'];

  // Compose the rows for the table: header (1 cell), then a row with N columns
  const tableRows = [
    headerRow,
    columns
  ];

  // Now, create the table via createTable
  const table = WebImporter.DOMUtils.createTable(tableRows, document);

  // To ensure the header cell spans all columns, set colspan on the first <th>
  const headerTh = table.querySelector('th');
  if (headerTh && columns.length > 1) {
    headerTh.setAttribute('colspan', String(columns.length));
  }

  element.replaceWith(table);
}
