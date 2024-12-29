// Add console log when content script loads
console.log('Table scraper content script loaded');

function scrapeTable() {
    console.log('Starting table scrape');
    
    // Get the city and state from h2
    const h2 = document.querySelector('h2');
    if (!h2) {
        console.error('No h2 element found');
        return { success: false, message: 'H2 not found' };
    }
    const cityState = h2.textContent.trim();
    console.log('Found city/state:', cityState);
    
    // Find the specific tbody with data-topic="Population", then get its parent table
    const tbody = document.querySelector('tbody[data-topic="Population"]');
    if (!tbody) {
        return { success: false, message: 'Table not found' };
    }
    
    const table = tbody.closest('table');
    if (!table) {
        return { success: false, message: 'Parent table not found' };
    }
    console.log('Found full table:', table);
    
    // Get all rows from the entire table
    const rows = table.querySelectorAll('tr');
    console.log('Number of rows found:', rows.length);
    
    const csvRows = [];
    
    // Convert rows to CSV format
    rows.forEach(row => {
        const cells = row.querySelectorAll('td, th');
        const csvRow = Array.from(cells)
            .map(cell => `"${cell.textContent.trim()}"`)
            .join(',');
        csvRows.push(csvRow);
    });
    
    const csvContent = csvRows.join('\n');
    
    return {
        success: true,
        data: csvContent,
        filename: `${cityState.replace(/[^a-zA-Z0-9]/g, '_')}_population.csv`
    };
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Received message:', request);
    if (request.action === 'scrapeTable') {
        const result = scrapeTable();
        console.log('Sending response:', result);
        sendResponse(result);
    }
    // Add return true to indicate async response
    return true;
}); 