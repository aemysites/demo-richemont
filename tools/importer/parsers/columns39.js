/* global WebImporter */
export default function parse(element, { document }) {
  // The header row must be exactly one cell with the exact block name from the example
  const headerRow = ['Columns block (columns39)'];

  // Now extract columns from the HTML structure
  const areaContainers = element.querySelectorAll('.umb-block-grid__area');

  let leftColumnContent = [];
  let rightColumnContent = [];

  areaContainers.forEach((area) => {
    const alias = area.getAttribute('data-area-alias');
    if (alias === 'left') {
      // Get all direct children layout items (headline, richtext, etc.) for left
      const layoutItems = area.querySelectorAll(':scope > .umb-block-grid__layout-container > .umb-block-grid__layout-item');
      layoutItems.forEach(item => {
        const block = item.querySelector(':scope > div');
        if (block) leftColumnContent.push(block);
      });
    } else if (alias === 'right') {
      // Right column: get video block
      const layoutItems = area.querySelectorAll(':scope > .umb-block-grid__layout-container > .umb-block-grid__layout-item');
      layoutItems.forEach(item => {
        const videoBlock = item.querySelector('.internal-video-block');
        if (videoBlock) {
          const videoEl = videoBlock.querySelector('video');
          if (videoEl) {
            const posterSrc = videoEl.getAttribute('poster');
            if (posterSrc) {
              const posterImg = document.createElement('img');
              posterImg.src = posterSrc;
              posterImg.alt = videoEl.getAttribute('title') || '';
              rightColumnContent.push(posterImg);
            }
            const source = videoEl.querySelector('source');
            if (source && source.getAttribute('src')) {
              const videoLink = document.createElement('a');
              videoLink.href = source.getAttribute('src');
              videoLink.textContent = 'Watch video';
              videoLink.target = '_blank';
              rightColumnContent.push(videoLink);
            }
          } else {
            // fallback: reference the block
            rightColumnContent.push(videoBlock);
          }
        }
      });
    }
  });

  // Compose cells array; header is a single cell; content row has two columns
  const cells = [
    headerRow,
    [leftColumnContent, rightColumnContent]
  ];

  // Create structured table block
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
