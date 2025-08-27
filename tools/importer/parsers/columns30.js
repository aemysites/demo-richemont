/* global WebImporter */
export default function parse(element, { document }) {
  // Find the two column area containers
  const areaContainers = element.querySelectorAll(':scope > .grid-container > .umb-block-grid__area-container > .umb-block-grid__area');
  if (areaContainers.length !== 2) return;

  // Helper to extract the main content block from an area (image/message blocks)
  function extractMainContent(area) {
    // Look for .umb-block-grid__layout-container
    const layoutContainer = area.querySelector(':scope > .umb-block-grid__layout-container');
    if (!layoutContainer) return area;
    // Get the first layout item
    const layoutItem = layoutContainer.querySelector(':scope > .umb-block-grid__layout-item');
    if (!layoutItem) return layoutContainer;
    // For images, return .image-block; for message, return .card-body if present
    const imageBlock = layoutItem.querySelector(':scope > .image-block');
    if (imageBlock) return imageBlock;
    const cardBody = layoutItem.querySelector(':scope > .card-body');
    if (cardBody) return cardBody;
    return layoutItem;
  }

  const leftContent = extractMainContent(areaContainers[0]);
  const rightContent = extractMainContent(areaContainers[1]);

  // Compose rows as per required structure
  const headerRow = ['Columns block (columns30)'];
  const contentRow = [leftContent, rightContent];
  const cells = [headerRow, contentRow];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
