/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare array to accumulate all node contents
  const cellContent = [];

  // Collect all child nodes (text and elements) from the top-level element
  Array.from(element.childNodes).forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      cellContent.push(node);
    } else if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent.trim();
      if (text) {
        cellContent.push(text);
      }
    }
  });

  // If a video is found, ensure a link to the video source is included per requirements
  const video = element.querySelector('video');
  if (video) {
    let videoSrc = '';
    const source = video.querySelector('source');
    if (source && source.getAttribute('src')) {
      videoSrc = source.getAttribute('src');
    } else if (video.getAttribute('src')) {
      videoSrc = video.getAttribute('src');
    }
    if (videoSrc) {
      // Resolve to absolute URL if necessary
      if (/^\//.test(videoSrc)) {
        let baseUrl = '';
        if (document.baseURI) {
          baseUrl = document.baseURI.replace(/\/$/, '');
        } else {
          baseUrl = window.location.origin;
        }
        videoSrc = baseUrl + videoSrc;
      }
      // Only add the link if not already present
      const alreadyLinked = cellContent.some((item) => {
        return item.nodeType === Node.ELEMENT_NODE && item.tagName === 'A' && item.href === videoSrc;
      });
      if (!alreadyLinked) {
        cellContent.push(document.createElement('br'));
        const link = document.createElement('a');
        link.href = videoSrc;
        link.textContent = videoSrc;
        cellContent.push(link);
      }
    }
  }

  // Ensure at least something is present in the cell
  const content = cellContent.length > 0 ? cellContent : ['']

  // Compose the table structure per block requirements
  const rows = [
    ['Embed'],
    [content]
  ];
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
