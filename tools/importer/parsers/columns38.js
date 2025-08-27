/* global WebImporter */
export default function parse(element, { document }) {
  // Table header matches example
  const headerRow = ['Columns block (columns38)'];

  // Find all columns (areas: left, middle, right) in order
  const areaContainers = element.querySelectorAll('.umb-block-grid__area');

  // Defensive: handle empty or missing areas
  const numColumns = areaContainers.length;
  // Collect each column's content as an array (image, text, quote)
  const columns = Array.from(areaContainers).map(area => {
    // For each area, collect all direct layout items (in order)
    const layoutItems = area.querySelectorAll(':scope > .umb-block-grid__layout-container > .umb-block-grid__layout-item');
    // For each item, find the first child div (the actual block, e.g. image-block, richtext-block, history-card-block)
    const blockNodes = Array.from(layoutItems).map(item => {
      // Defensive: get the first child div under each layout-item
      // There should always be one but in case of template change, fallback to the item itself
      const blockDiv = item.querySelector(':scope > div') || item;
      return blockDiv;
    });
    // If only one block, return the block element, else an array
    if (blockNodes.length === 1) {
      return blockNodes[0];
    } else {
      return blockNodes;
    }
  });

  // The second row should contain as many cells as there are columns
  // No extra rows beyond what's in the source
  const contentRow = columns;

  // Create and replace with the block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);
  element.replaceWith(table);
}
