/* global WebImporter */
export default function parse(element, { document }) {
  // The header must be a single-cell row, per the specification
  const headerRow = ['Columns block (columns16)'];

  // Find all .umb-block-grid__area (each is a column)
  const areaNodes = element.querySelectorAll('.umb-block-grid__area');
  // For each column, extract its card content
  const columns = Array.from(areaNodes).map(area => {
    const card = area.querySelector('.history-card-block.card.h-100');
    if (!card) return '';
    const content = [];
    // Image
    const img = card.querySelector('img');
    if (img) content.push(img);
    // Title
    const title = card.querySelector('.card-title');
    if (title) content.push(title);
    // Paragraph
    const para = card.querySelector('.history-card-block__text');
    if (para) content.push(para);
    // Footer link
    const footer = card.querySelector('.card-footer');
    if (footer) {
      const link = footer.querySelector('a');
      if (link) content.push(link);
    }
    return content;
  });
  // Compose table: header row (1 column), then content row (N columns)
  const cells = [headerRow, columns];
  // Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
