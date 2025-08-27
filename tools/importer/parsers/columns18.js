/* global WebImporter */
export default function parse(element, { document }) {
  // Gather columns from the layout
  const areaContainers = element.querySelectorAll('.umb-block-grid__area');
  const columns = [];
  for (let i = 0; i < areaContainers.length; i++) {
    let colContent = document.createTextNode('');
    const layoutContainer = areaContainers[i].querySelector(':scope > .umb-block-grid__layout-container');
    if (layoutContainer) {
      const layoutItem = layoutContainer.querySelector(':scope > .umb-block-grid__layout-item');
      if (layoutItem) {
        const figure = layoutItem.querySelector(':scope > .flexible-figure-block');
        if (figure) {
          colContent = figure;
        } else {
          colContent = layoutItem;
        }
      } else {
        colContent = layoutContainer;
      }
    } else {
      colContent = areaContainers[i];
    }
    columns.push(colContent);
  }
  // Header row: one cell only, matching the block name
  const headerRow = ['Columns block (columns18)'];
  const tableArr = [headerRow, columns];
  const table = WebImporter.DOMUtils.createTable(tableArr, document);
  // Ensure header <th> has colspan to span all columns
  const headerTr = table.querySelector('tr:first-child');
  if (headerTr && headerTr.firstElementChild) {
    headerTr.firstElementChild.setAttribute('colspan', columns.length);
    // Remove any extra <th> cells if present, for absolute correctness
    while (headerTr.children.length > 1) {
      headerTr.removeChild(headerTr.lastChild);
    }
  }
  element.replaceWith(table);
}
