/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the Instagram hero block
  const heroBlock = element.querySelector('.instagram-hero-block');
  if (!heroBlock) return;
  // Locate the list of card <li> elements
  const cardsList = heroBlock.querySelector('ul.instagram-hero-block__cards-list');
  if (!cardsList) return;
  const cardLis = Array.from(cardsList.children).filter(li => li.tagName === 'LI');

  // Extract all content (text, elements, images, etc) from each <li>
  const columns = cardLis.map(li => {
    const colContent = [];
    li.childNodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        colContent.push(node);
      } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0) {
        // Preserve text nodes by wrapping in a <span>
        const span = document.createElement('span');
        span.textContent = node.textContent.trim();
        colContent.push(span);
      }
    });
    return colContent.length === 1 ? colContent[0] : colContent;
  });

  const tableRows = [
    ['Columns block (columns11)'],
    columns
  ];

  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
