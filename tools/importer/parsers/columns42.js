/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row per example
  const headerRow = ['Columns block (columns42)'];

  // Find the top-level column areas
  const areaContainers = element.querySelectorAll('.umb-block-grid__area');
  if (areaContainers.length < 2) return; // Defensive, must have two columns

  // LEFT COLUMN: Find the .message-block content
  const leftArea = areaContainers[0];
  const leftBlock = leftArea.querySelector('.message-block');

  // RIGHT COLUMN: Find the .image-block content
  const rightArea = areaContainers[1];
  const rightBlock = rightArea.querySelector('.image-block');

  // Defensive: If either column is missing, abort
  if (!leftBlock || !rightBlock) return;

  // Structure matches example: header row, then a single content row with two columns
  const cells = [headerRow, [leftBlock, rightBlock]];

  const blockTable = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(blockTable);
}
