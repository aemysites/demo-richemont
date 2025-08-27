/* global WebImporter */
export default function parse(element, { document }) {
  // Block header matches example exactly
  const rows = [['Cards (cardsNoImages36)']];

  // Find all card items (each .list-li.listing-item.calendar-listing)
  const cardItems = element.querySelectorAll('.accordion-body .list-li.listing-item.calendar-listing');
  cardItems.forEach((card) => {
    // Create a cell content array
    const cellContent = [];

    // card children may include: date, title, time
    // Gather the children in order, maintaining semantic structure
    // 1. clndr-date (as <p>)
    const dateEl = card.querySelector('.clndr-date');
    if (dateEl && dateEl.textContent.trim()) {
      cellContent.push(dateEl);
    }
    // 2. clndr-title (as <strong> inside p for separation, or just <strong>)
    const titleEl = card.querySelector('.clndr-title');
    if (titleEl && titleEl.textContent.trim()) {
      // Use the existing element, but ensure it's strong
      const strong = document.createElement('strong');
      strong.textContent = titleEl.textContent.trim();
      cellContent.push(strong);
    }
    // 3. clndr-time (as <p>)
    const timeEl = card.querySelector('.clndr-time');
    if (timeEl && timeEl.textContent.trim()) {
      cellContent.push(timeEl);
    }
    // If the card contains additional relevant block children, add them here

    // Only add row if there's content
    if (cellContent.length) {
      rows.push([cellContent]);
    }
  });

  // Create and replace with the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
