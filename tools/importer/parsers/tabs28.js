/* global WebImporter */
export default function parse(element, { document }) {
  // Find the container holding the tab buttons
  const tabsContainer = element.querySelector('.nav-tabs');
  if (!tabsContainer) return;
  const tabButtons = Array.from(tabsContainer.querySelectorAll('button'));
  if (tabButtons.length === 0) return;

  // Build table manually: first row is a single cell header, others are two columns
  const table = document.createElement('table');

  // Header row: single th spanning two columns
  const headerTr = document.createElement('tr');
  const headerTh = document.createElement('th');
  headerTh.textContent = 'Tabs';
  headerTh.colSpan = '2';
  headerTr.appendChild(headerTh);
  table.appendChild(headerTr);

  // Rows for each tab
  tabButtons.forEach(btn => {
    const tr = document.createElement('tr');
    const tdLabel = document.createElement('td');
    tdLabel.textContent = btn.textContent.trim();
    const tdContent = document.createElement('td');
    tdContent.textContent = '';
    tr.appendChild(tdLabel);
    tr.appendChild(tdContent);
    table.appendChild(tr);
  });

  element.replaceWith(table);
}
