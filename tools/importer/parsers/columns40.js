/* global WebImporter */
export default function parse(element, { document }) {
  // Find the section containing the cards block
  const cardsSection = element.querySelector('section.document-cards-block');
  if (!cardsSection) return;
  // Find the list of cards
  const cardsList = cardsSection.querySelector('.document-cards-block__cards-list');
  if (!cardsList) return;
  // Get all individual card elements
  const cardElements = Array.from(cardsList.querySelectorAll('.document-card-block'));
  // Build the columns array: each cell is the card's content in an array
  const columns = cardElements.map(card => {
    const items = [];
    const title = card.querySelector('.card-title');
    if (title) items.push(title);
    const link = card.querySelector('a');
    if (link) items.push(link);
    return items;
  });
  // Header row: exactly one column, as required
  const headerRow = ['Columns block (columns40)'];
  // Second row: a single array with N columns
  const secondRow = [...columns];
  // Table structure: first row is single column, second row is N columns
  const cells = [headerRow, secondRow];
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(blockTable);
}
