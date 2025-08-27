/* global WebImporter */
export default function parse(element, { document }) {
  // Get the block containing the cards
  const cardsList = element.querySelector('.document-cards-block__cards-list');
  if (!cardsList) return;

  // All immediate card children
  const cards = Array.from(cardsList.children).filter(card => card.classList.contains('manually-pick-item-card'));
  
  // Build the rows for the table
  const rows = [['Cards (cards22)']];
  
  cards.forEach(card => {
    // Image (mandatory)
    const img = card.querySelector('img');
    // Text content (title + description)
    const cardBody = card.querySelector('.card-body');
    const cellContent = [];
    if (cardBody) {
      // Title (as heading)
      const heading = cardBody.querySelector('h3');
      if (heading) cellContent.push(heading);
      // Description
      const desc = cardBody.querySelector('p');
      if (desc) cellContent.push(desc);
    }
    // Add the card row: [image, [title, desc]]
    rows.push([
      img,
      cellContent.length === 1 ? cellContent[0] : cellContent
    ]);
  });
  
  // Create table and replace the element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
