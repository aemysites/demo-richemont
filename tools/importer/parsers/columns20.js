/* global WebImporter */
export default function parse(element, { document }) {
  // Get all immediate <li> children as columns
  const columns = Array.from(element.children).filter(child => child.tagName === 'LI');
  const numColumns = columns.length;

  // For each column, get its img(s) or children
  const contentRow = columns.map(li => {
    const imgs = Array.from(li.querySelectorAll(':scope > img'));
    if (imgs.length === 1) return imgs[0];
    if (imgs.length > 1) return imgs;
    if (li.children.length > 0) return Array.from(li.children);
    return '';
  });

  // Manually create the correct table structure with a single cell header row that spans all columns
  const table = document.createElement('table');

  // Header row
  const trHeader = document.createElement('tr');
  const th = document.createElement('th');
  th.textContent = 'Columns block (columns20)';
  if (numColumns > 1) th.colSpan = numColumns;
  trHeader.appendChild(th);
  table.appendChild(trHeader);

  // Content row
  const trContent = document.createElement('tr');
  contentRow.forEach(cell => {
    const td = document.createElement('td');
    if (Array.isArray(cell)) {
      td.append(...cell);
    } else if (typeof cell === 'string') {
      td.innerHTML = cell;
    } else if (cell) {
      td.append(cell);
    }
    trContent.appendChild(td);
  });
  table.appendChild(trContent);

  element.replaceWith(table);
}
