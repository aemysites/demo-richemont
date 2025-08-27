/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row: block name
  const headerRow = ['Cards (cards19)'];

  // 2. Find the board-members cards list
  const boardMembersBlock = element.querySelector('.board-members-block');
  if (!boardMembersBlock) return;
  const ol = boardMembersBlock.querySelector('ol');
  if (!ol) return;

  // 3. Each <li> is a card: extract image, title, position, and optional link
  const rows = [];
  ol.querySelectorAll(':scope > li.card.board-member').forEach((li) => {
    // First cell: image
    const img = li.querySelector('img.board-member__image');

    // Second cell: title, position, and CTA link (in order)
    const textContent = [];
    const cardBody = li.querySelector('.card-body');
    if (cardBody) {
      const titleEl = cardBody.querySelector('h3.card-title');
      if (titleEl) textContent.push(titleEl);
      const posEl = cardBody.querySelector('.board-member__position');
      if (posEl) textContent.push(posEl);
    }
    // CTA link (card-footer > a)
    const cardFooter = li.querySelector('.card-footer');
    if (cardFooter) {
      const cta = cardFooter.querySelector('a.board-member__link');
      if (cta) textContent.push(cta);
    }
    rows.push([img, textContent]);
  });

  // 4. Compose final table: header row + all cards
  const cells = [headerRow, ...rows];

  // 5. Create table and replace original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
