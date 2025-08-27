/* global WebImporter */
export default function parse(element, { document }) {
  // Find the area container, which determines the columns
  const areaContainer = element.querySelector('.umb-block-grid__area-container');
  if (!areaContainer) return;
  const areas = Array.from(areaContainer.querySelectorAll(':scope > .umb-block-grid__area'));

  // Helper to extract blocks for each area in a semantic, concise manner
  function getAreaContent(area) {
    // Gather headline (if present)
    const headline = area.querySelector('.footer-headline');
    // Gather all footer-links blocks in this area
    const linkBlocks = Array.from(area.querySelectorAll('.footer-links'));
    // Gather subscribe block (if present)
    const subscribe = area.querySelector('.subscribe-initial-block');
    // Gather social block (if present)
    const social = area.querySelector('.footer-social');
    // Gather logo (first column)
    const logo = area.querySelector('.richemont-logo')?.closest('div');

    // Build up content per column as per their semantics in the HTML
    // 1st column: logo
    if (logo) return logo;

    // 2nd column: headline + links + subscribe + social
    const nodes = [];
    if (headline) nodes.push(headline);
    linkBlocks.forEach(l => nodes.push(l));
    if (subscribe) nodes.push(subscribe);
    if (social) nodes.push(social);
    if (nodes.length === 1) return nodes[0];
    if (nodes.length > 1) return nodes;

    // 3rd and 4th columns: headline + links
    if (headline || linkBlocks.length) {
      const arr = [];
      if (headline) arr.push(headline);
      linkBlocks.forEach(l => arr.push(l));
      if (arr.length === 1) return arr[0];
      if (arr.length > 1) return arr;
    }

    // fallback: area (shouldn't happen)
    return area;
  }

  const columns = areas.map(getAreaContent);
  const headerRow = ['Columns block (columns10)'];
  const rows = [headerRow, columns];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
