/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: must match the block name exactly
  const headerRow = ['Columns block (columns34)'];

  // Find the left and right column content areas
  // Defensive: If structure changes, we fall back to whatever is present
  let leftContent = '', rightContent = '';
  
  const gridContainer = element.querySelector('.grid-container');
  if (gridContainer) {
    const areas = gridContainer.querySelectorAll('.umb-block-grid__area');
    // We expect two areas
    if (areas.length === 2) {
      // Extract content for left area
      const leftArea = areas[0];
      const leftLayoutContainer = leftArea.querySelector('.umb-block-grid__layout-container');
      if (leftLayoutContainer) {
        // We expect an .umb-block-grid__layout-item inside
        const leftItem = leftLayoutContainer.querySelector('.umb-block-grid__layout-item');
        if (leftItem) {
          // The actual block content is the first child (the image-block)
          const leftBlock = leftItem.querySelector('.image-block');
          if (leftBlock) leftContent = leftBlock;
          else leftContent = leftItem;
        } else {
          leftContent = leftLayoutContainer;
        }
      } else {
        leftContent = leftArea;
      }

      // Extract content for right area
      const rightArea = areas[1];
      const rightLayoutContainer = rightArea.querySelector('.umb-block-grid__layout-container');
      if (rightLayoutContainer) {
        const rightItem = rightLayoutContainer.querySelector('.umb-block-grid__layout-item');
        if (rightItem) {
          // The content is the .message-block
          const rightBlock = rightItem.querySelector('.message-block');
          if (rightBlock) rightContent = rightBlock;
          else rightContent = rightItem;
        } else {
          rightContent = rightLayoutContainer;
        }
      } else {
        rightContent = rightArea;
      }
    }
  }

  // Fallback in case the structure is different
  if (!leftContent || !rightContent) {
    const fallbackAreas = element.querySelectorAll('.umb-block-grid__area');
    if (fallbackAreas.length > 0 && !leftContent) leftContent = fallbackAreas[0];
    if (fallbackAreas.length > 1 && !rightContent) rightContent = fallbackAreas[1];
  }

  // Build the content row with both columns
  const contentRow = [leftContent, rightContent];

  // Compose the table: header, then the columns row
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new block table
  element.replaceWith(table);
}
