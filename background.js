chrome.action.onClicked.addListener((tab) => {
    console.log('Extension button clicked');
    
    // Check if we have a valid tab
    if (!tab.id) {
        console.error('No tab ID available');
        return;
    }

    chrome.tabs.sendMessage(tab.id, { action: 'scrapeTable' }, (response) => {
        if (chrome.runtime.lastError) {
            console.error('Runtime error:', chrome.runtime.lastError);
            return;
        }

        console.log('Received response:', response);

        if (response && response.success) {
            // Convert the CSV data to a data URL
            const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(response.data);
            
            chrome.downloads.download({
                url: csvContent,
                filename: response.filename,
                saveAs: true
            });
        } else {
            console.error('Failed to scrape table:', response?.message);
        }
    });
}); 