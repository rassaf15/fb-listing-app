exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { searchQuery, ebayAppId } = JSON.parse(event.body);
    
    if (!searchQuery || !ebayAppId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required parameters' })
      };
    }

    // Build eBay API URL
    const endpoint = 'https://svcs.ebay.com/services/search/FindingService/v1';
    const params = new URLSearchParams({
      'OPERATION-NAME': 'findCompletedItems',
      'SERVICE-VERSION': '1.0.0',
      'SECURITY-APPNAME': ebayAppId,
      'RESPONSE-DATA-FORMAT': 'JSON',
      'REST-PAYLOAD': '',
      'keywords': searchQuery,
      'itemFilter(0).name': 'Condition',
      'itemFilter(0).value': 'Used',
      'itemFilter(1).name': 'SoldItemsOnly',
      'itemFilter(1).value': 'true',
      'sortOrder': 'EndTimeSoonest',
      'paginationInput.entriesPerPage': '20'
    });

    const ebayUrl = `${endpoint}?${params}`;
    
    // Call eBay API from server (no CORS issues here)
    const response = await fetch(ebayUrl);
    
    if (!response.ok) {
      throw new Error(`eBay API returned status ${response.status}`);
    }
    
    const data = await response.json();

    // Return data with CORS headers for browser
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };
    
  } catch (error) {
    console.error('Error calling eBay API:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        error: 'Failed to fetch eBay data',
        message: error.message 
      })
    };
  }
};
