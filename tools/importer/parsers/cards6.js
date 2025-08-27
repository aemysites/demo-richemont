/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row as specified
  const cells = [['Cards (cards6)']];

  // Find all image card items in correct order
  const layoutItems = element.querySelectorAll('.umb-block-grid__layout-item[data-content-element-type-alias="imageBlock"]');

  layoutItems.forEach(item => {
    // Reference the image-block wrapper for text context
    const block = item.querySelector('.image-block');
    let cardImage = null;
    let cardTextElem = document.createElement('div');

    if (block) {
      // Get image element (reference, not clone)
      cardImage = block.querySelector('img');
      // Compose text content from alt and any visible text nodes (for future flexibility)
      if (cardImage && cardImage.alt) {
        // Use strong for the card title, keeping semantic meaning
        const strong = document.createElement('strong');
        strong.textContent = cardImage.alt;
        cardTextElem.appendChild(strong);
      }
      // If there is additional visible text within the link, append below
      const link = block.querySelector('a');
      if (link) {
        // Extract all direct text nodes (excluding nested tags like img)
        link.childNodes.forEach(node => {
          if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
            const p = document.createElement('p');
            p.textContent = node.textContent.trim();
            cardTextElem.appendChild(p);
          }
        });
      }
    }
    // If no text content, ensure cell not empty
    if (!cardTextElem.childNodes.length) {
      cardTextElem.appendChild(document.createTextNode(''));
    }
    cells.push([cardImage, cardTextElem]);
  });

  // Create and replace with the block table
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(blockTable);
}
