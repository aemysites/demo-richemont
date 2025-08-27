/* global WebImporter */
export default function parse(element, { document }) {
  // Find left/right areas by their alias
  const areas = Array.from(
    element.querySelectorAll('.umb-block-grid__area')
  );

  // Helper to gather all top-level content blocks from a given area
  function getAreaContent(area) {
    const content = [];
    // .umb-block-grid__layout-container > .umb-block-grid__layout-item
    const items = area.querySelectorAll('.umb-block-grid__layout-container > .umb-block-grid__layout-item');
    items.forEach(item => {
      Array.from(item.children).forEach(child => {
        // Only reference the existing child elements
        content.push(child);
      });
    });
    return content;
  }

  // Always two columns for columns2 block
  let leftContent = [], rightContent = [];
  if (areas.length >= 2) {
    leftContent = getAreaContent(areas[0]);
    rightContent = getAreaContent(areas[1]);
  }

  // Fallback if structure doesn't match: put all direct children in first column
  if (leftContent.length === 0 && rightContent.length === 0) {
    leftContent = Array.from(element.children);
  }

  // Build block table cells
  const headerRow = ['Columns block (columns2)']; // Only one column for the header row
  const contentRow = [leftContent, rightContent]; // two columns for content
  const cells = [headerRow, contentRow];

  // Create the table using the provided helper
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // After creation, set the header cell's colspan to span all columns
  const th = table.querySelector('th');
  if (th) {
    th.setAttribute('colspan', String(contentRow.length));
  }

  // Replace original element
  element.replaceWith(table);
}
