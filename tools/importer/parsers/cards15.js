/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to trim and clean text
  function cleanText(text) {
    return (text || '').replace(/\s+/g, ' ').trim();
  }

  const rows = [];
  // Header row, exactly as in the example
  rows.push(['Cards (cards15)']);

  // Get each of the four card areas in order
  const areaContainers = element.querySelectorAll(':scope > .grid-container > .umb-block-grid__area-container > .umb-block-grid__area');

  areaContainers.forEach(area => {
    // Each area has an image block and a message block, order may vary
    let imgElem = null;
    let contentElem = null;
    const layoutItems = area.querySelectorAll(':scope > .umb-block-grid__layout-container > .umb-block-grid__layout-item');
    layoutItems.forEach(item => {
      if (!imgElem) {
        imgElem = item.querySelector('img');
      }
      if (!contentElem) {
        contentElem = item.querySelector('.message-block');
      }
    });
    // Defensive: skip if either is missing
    if (!imgElem || !contentElem) return;

    // Content cell fragment
    const contentFrag = document.createElement('div');

    // Heading (preserve as <strong> as in markdown)
    const heading = contentElem.querySelector('.card-subtitle');
    if (heading && cleanText(heading.textContent)) {
      const strong = document.createElement('strong');
      strong.textContent = cleanText(heading.textContent);
      contentFrag.appendChild(strong);
      contentFrag.appendChild(document.createElement('br'));
    }

    // Description paragraph
    const desc = contentElem.querySelector('p');
    if (desc && cleanText(desc.textContent)) {
      contentFrag.appendChild(desc);
    }

    // Card footer links (CTAs)
    const footer = contentElem.querySelector('.card-footer');
    if (footer) {
      // Only anchor tags (skip placeholder divs)
      const ctas = Array.from(footer.querySelectorAll('a'));
      if (ctas.length) {
        // Separate line for CTAs
        contentFrag.appendChild(document.createElement('br'));
        ctas.forEach((a, idx) => {
          // Remove the icon span for clean text
          const aCopy = a.cloneNode(true);
          const icon = aCopy.querySelector('span');
          if (icon) icon.remove();
          // Clean up whitespace in the link text
          aCopy.textContent = cleanText(aCopy.textContent);
          contentFrag.appendChild(aCopy);
          if (idx !== ctas.length - 1) {
            contentFrag.appendChild(document.createElement('br'));
          }
        });
      }
    }

    rows.push([imgElem, contentFrag]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
