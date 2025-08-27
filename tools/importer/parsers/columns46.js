/* global WebImporter */
export default function parse(element, { document }) {
  // Find the left and right column containers
  const areaContainers = element.querySelectorAll(':scope > .grid-container > .umb-block-grid__area-container > .umb-block-grid__area');
  if (areaContainers.length !== 2) return;
  // Helper to extract all layout-item content in order for a given area
  function extractAreaContent(area) {
    const layoutItems = area.querySelectorAll(':scope > .umb-block-grid__layout-container > .umb-block-grid__layout-item');
    const contents = [];
    layoutItems.forEach(layoutItem => {
      // Use the direct child (the block itself)
      const block = layoutItem.firstElementChild;
      if (!block) return;
      // For image-block, just use the image
      if (block.classList.contains('image-block')) {
        const img = block.querySelector('img');
        if (img) contents.push(img);
      } else {
        // For headline or richtext block, push all children (preserve headings, paragraphs, links)
        Array.from(block.children).forEach(child => contents.push(child));
      }
    });
    return contents;
  }
  const leftContent = extractAreaContent(areaContainers[0]);
  const rightContent = extractAreaContent(areaContainers[1]);
  // Build the table
  const headerRow = ['Columns block (columns46)'];
  const cells = [
    headerRow,
    [leftContent, rightContent]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
