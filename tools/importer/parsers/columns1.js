/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: must be exactly 1 cell according to requirements
  const headerRow = ['Columns block (columns1)'];

  // Find the grid container
  const gridContainer = element.querySelector('.grid-container--twoXtwo');
  if (!gridContainer) return;
  // Find all column areas (should be two)
  const areaContainers = gridContainer.querySelectorAll(':scope > .umb-block-grid__area-container > .umb-block-grid__area');
  if (areaContainers.length < 2) return;

  // For each area, extract all content from its layout-items
  function extractAreaContent(area) {
    const layoutItems = area.querySelectorAll(':scope > .umb-block-grid__layout-container > .umb-block-grid__layout-item');
    const cellElements = [];
    layoutItems.forEach(item => {
      // Prefer message-block card-body children
      const msgBlock = item.querySelector('.message-block');
      if (msgBlock) {
        const cardBody = msgBlock.querySelector('.card-body');
        if (cardBody) {
          Array.from(cardBody.childNodes).forEach(node => {
            if (node.nodeType === 3 && node.textContent.trim()) {
              const span = document.createElement('span');
              span.textContent = node.textContent.trim();
              cellElements.push(span);
            } else if (node.nodeType === 1) {
              cellElements.push(node);
            }
          });
        }
      }
      // Otherwise image block
      const imgBlock = item.querySelector('.image-block');
      if (imgBlock) {
        cellElements.push(imgBlock);
      }
    });
    // Text fallback
    if (cellElements.length === 0 && area.textContent.trim()) {
      const span = document.createElement('span');
      span.textContent = area.textContent.trim();
      cellElements.push(span);
    }
    // Collapsing array if only 1 element
    if (cellElements.length === 1) return cellElements[0];
    if (cellElements.length > 1) return cellElements;
    return '';
  }
  // Construct second row with as many columns as there are areas
  const contentRow = Array.from(areaContainers).map(extractAreaContent);

  // Compose table: header row is always 1 column, content row has N columns
  const cells = [headerRow, contentRow];

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
