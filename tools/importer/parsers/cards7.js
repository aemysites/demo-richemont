/* global WebImporter */
export default function parse(element, { document }) {
  // Header row (must match example exactly)
  const headerRow = ['Cards (cards7)'];

  // Find all visible cards (ignore those styled with display:none)
  const cardElements = Array.from(element.querySelectorAll('.document-card-block.card'))
    .filter(card => card.style.display !== 'none');

  const rows = cardElements.map(card => {
    // Image (first <img> in card)
    const img = card.querySelector('img');

    // Text cell content
    const textCell = document.createElement('div');

    // Card body
    const cardBody = card.querySelector('.card-body');
    if (cardBody) {
      // Card type (subtitle)
      const type = cardBody.querySelector('.document-card-block__type');
      if (type) {
        // Use a <span> directly from the source for type/label (preserving text)
        const typeSpan = document.createElement('span');
        typeSpan.textContent = type.textContent;
        typeSpan.className = 'card-type';
        typeSpan.style.display = 'block';
        typeSpan.style.fontSize = '0.8em';
        typeSpan.style.textTransform = 'uppercase';
        typeSpan.style.marginBottom = '2px';
        textCell.appendChild(typeSpan);
      }

      // Card title (Heading)
      const title = cardBody.querySelector('.card-title');
      if (title) {
        textCell.appendChild(title);
      }
    }

    // Footer/Link/CTA
    const footer = card.querySelector('.card-footer');
    if (footer) {
      // Only include links with non-empty text
      const link = footer.querySelector('a');
      if (link && link.textContent.trim().length > 0) {
        const ctaDiv = document.createElement('div');
        ctaDiv.appendChild(link);
        textCell.appendChild(ctaDiv);
      }
    }

    // All text in the card body that is not the type or title (e.g., description)
    if (cardBody) {
      Array.from(cardBody.childNodes).forEach(child => {
        if (child.nodeType === Node.ELEMENT_NODE &&
            !child.classList.contains('document-card-block__type') &&
            !child.classList.contains('card-title')) {
          textCell.appendChild(child);
        }
        // If there is text directly in cardBody (not wrapped), append it
        if (child.nodeType === Node.TEXT_NODE && child.textContent.trim().length > 0) {
          const textNodeDiv = document.createElement('div');
          textNodeDiv.textContent = child.textContent.trim();
          textCell.appendChild(textNodeDiv);
        }
      });
    }

    return [img, textCell];
  });

  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
