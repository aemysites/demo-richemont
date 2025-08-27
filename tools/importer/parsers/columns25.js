/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main area that contains everything (usually with data-area-alias="all")
  const mainArea = element.querySelector('.umb-block-grid__area[data-area-alias="all"]');
  if (!mainArea) return;

  // Within that, find the inner layout item for latestJobsListings
  const listingsLayout = mainArea.querySelector('.umb-block-grid__layout-item[data-content-element-type-alias="latestJobsListings"]');
  if (!listingsLayout) return;

  // In that, locate the two column areas inside the job listing component
  const jobListingsComponent = listingsLayout.querySelector('.job-listings-component');
  if (!jobListingsComponent) return;
  const areaContainer = jobListingsComponent.querySelector('.umb-block-grid__area-container');
  if (!areaContainer) return;
  // Get all the direct children that are areas (should be two for left and right columns)
  const columnAreas = Array.from(areaContainer.children).filter((child) => child.classList.contains('umb-block-grid__area'));
  if (columnAreas.length === 0) return;

  // For each area, extract the main content block (first child)
  const cells = columnAreas.map(area => {
    // Usually, there's only a single meaningful content block in each area
    for (let i = 0; i < area.children.length; i++) {
      const child = area.children[i];
      // Only return if it's not an empty job-list (which is empty)
      // If it has visible content, use it
      if (child.textContent.trim() !== '' || child.querySelector('a, p, h1, h2, h3, h4, h5, h6, span')) {
        return child;
      }
    }
    // fallback: return the area itself if there is nothing else
    return area;
  });

  // Build the block table, ensuring header row is a single cell spanning all columns
  const table = WebImporter.DOMUtils.createTable([
    ['Columns block (columns25)'],
    cells
  ], document);

  // Ensure the header <th> spans all columns
  const headerRow = table.querySelector('tr');
  if (headerRow && headerRow.children.length === 1 && cells.length > 1) {
    headerRow.firstElementChild.setAttribute('colspan', cells.length);
  }

  element.replaceWith(table);
}
