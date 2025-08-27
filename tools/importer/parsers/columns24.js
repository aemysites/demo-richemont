/* global WebImporter */
export default function parse(element, { document }) {
  // Header row must be a single column (array with one string)
  const headerRow = ['Columns block (columns24)'];

  // Find the brands grid/div (expected to be only direct child)
  let brandsBlock = Array.from(element.children).find(
    (el) => el.classList && el.classList.contains('brands-block')
  );
  if (!brandsBlock) brandsBlock = element;

  // Collect all immediate anchor children (not using querySelectorAll to avoid deep nesting)
  // This ensures only direct logos of this block are included
  const brandLinks = Array.from(brandsBlock.children).filter(
    (el) => el.tagName === 'A' && el.classList.contains('brands-block__link')
  );

  // Compose table rows (header, data row)
  // The data row should have as many columns as there are brands (one anchor per column)
  const cells = [headerRow, brandLinks.length ? brandLinks : ['']];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
