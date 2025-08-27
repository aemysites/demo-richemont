/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid container
  const gridContainer = element.querySelector('.grid-container');
  if (!gridContainer) return;
  // Get the two area containers (left and right columns)
  const areas = gridContainer.querySelectorAll(':scope > .umb-block-grid__area-container > .umb-block-grid__area');
  if (areas.length !== 2) return;
  const leftArea = areas[0];
  const rightArea = areas[1];

  // Helper to extract all block elements (richtext-block or image-block) from an area
  function extractContent(area) {
    const layoutContainers = area.querySelectorAll(':scope > .umb-block-grid__layout-container > .umb-block-grid__layout-item');
    const contentNodes = [];
    layoutContainers.forEach(item => {
      // We want the direct block, not all descendants, and preserve order
      let block = item.querySelector('.richtext-block, .image-block');
      if (block) contentNodes.push(block);
    });
    if (contentNodes.length === 0) return '';
    if (contentNodes.length === 1) return contentNodes[0];
    return contentNodes;
  }

  const leftContent = extractContent(leftArea);
  const rightContent = extractContent(rightArea);

  // Header must match example exactly
  const headerRow = ['Columns block (columns3)'];
  const contentRow = [leftContent, rightContent];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  element.replaceWith(table);
}
