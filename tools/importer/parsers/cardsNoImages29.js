/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as per the example
  const headerRow = ['Cards (cardsNoImages29)'];
  const rows = [headerRow];
  // Find the correct <ol> containing the cards
  const boardBlock = element.querySelector('.board-members-block');
  if (!boardBlock) return;
  const ol = boardBlock.querySelector('ol');
  if (!ol) return;
  const cards = ol.querySelectorAll('li.card.board-member');
  cards.forEach((card) => {
    const cardBody = card.querySelector('.card-body');
    const cardFooter = card.querySelector('.card-footer');
    // Compose one cell with: bold name, position (on new line), link (on new line)
    const cell = document.createElement('div');
    // Name/title in bold
    const title = cardBody && cardBody.querySelector('.card-title');
    if (title && title.textContent) {
      const strong = document.createElement('strong');
      strong.textContent = title.textContent.trim();
      cell.appendChild(strong);
      cell.appendChild(document.createElement('br'));
    }
    // Position/description
    const position = cardBody && cardBody.querySelector('.board-member__position');
    if (position && position.textContent) {
      cell.appendChild(document.createTextNode(position.textContent.trim()));
      cell.appendChild(document.createElement('br'));
    }
    // CTA link
    const cta = cardFooter && cardFooter.querySelector('a.board-member__link');
    if (cta) {
      // Reference the existing anchor, but remove icon span
      const ctaClone = cta.cloneNode(true); // shallow clone for safety
      // Remove the icon span if present
      const icon = ctaClone.querySelector('span');
      if (icon) icon.remove();
      ctaClone.textContent = cta.textContent.replace(/\s*See /, 'See ').trim();
      cell.appendChild(ctaClone);
    }
    rows.push([cell]);
  });
  // Create the table and replace the block in the DOM
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
