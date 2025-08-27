/* global WebImporter */
export default function parse(element, { document }) {
  // Find all .results-table > table elements
  const tables = Array.from(element.querySelectorAll('.results-table > table'));
  if (!tables.length) return;

  // Find the first .table-foot DIV outside the tables (if any)
  // We'll add it after all block tables, if it exists
  const outsideFoot = element.querySelector('.table-foot');
  let footnoteElement = null;
  if (outsideFoot) {
    footnoteElement = outsideFoot;
  }

  // For each table, create a block table with header row ['Table (bordered)'] and the table as its only cell
  const blockTables = tables.map((tbl) => {
    // If this table has a <tr class="table-foot"> inside, remove it for separate handling and avoid duplication
    const tf = tbl.querySelector('tr.table-foot');
    if (tf) tf.parentElement.removeChild(tf);
    const rows = [
      ['Table (bordered)'],
      [tbl],
    ];
    // If the table-foot was inside and we have no outside footnote, use that as a third row
    if (tf && !footnoteElement) {
      rows.push([tf]);
    }
    return WebImporter.DOMUtils.createTable(rows, document);
  });

  // If there is a footnoteElement outside, append it as its own row in a final block table
  let footBlock = null;
  if (footnoteElement) {
    footBlock = WebImporter.DOMUtils.createTable([
      ['Table (bordered)'],
      [footnoteElement],
    ], document);
  }

  // Replace the original element with all block tables (and footnote block if present)
  const fragment = document.createDocumentFragment();
  blockTables.forEach(bt => fragment.appendChild(bt));
  if (footBlock) {
    fragment.appendChild(footBlock);
  }
  element.replaceWith(fragment);
}
