exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { searchQuery, analysisText, manualBrand, manualModel, ebayAppId } = JSON.parse(event.body);
    
    if (!ebayAppId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing eBay App ID' })
      };
    }

    let finalSearchQuery = searchQuery;

    // If no search query provided, extract from analysis text
    if (!finalSearchQuery && analysisText) {
      // Extract brand - look for common patterns
      let brand = manualBrand || '';
      if (!brand) {
        const brandMatch = analysisText.match(/(?:Brand|Manufacturer):\s*([^\n,]+)/i);
        if (brandMatch) {
          brand = brandMatch[1].trim();
        } else {
          // Check for common brands
          const brands = ['Sony', 'Apple', 'Samsung', 'Microsoft', 'Nintendo', 'Square', 'HP', 'Dell', 'Lenovo', 'LG', 'Canon', 'Nikon', 'Google'];
          for (const b of brands) {
            if (analysisText.toLowerCase().includes(b.toLowerCase())) {
              brand = b;
              break;
            }
          }
        }
      }

      // Extract model
      let model = manualModel || '';
      if (!model) {
        // Look for model number patterns
        const modelMatch = analysisText.match(/(?:Model|Model\s*(?:Number|No\.?|#)):\s*([^\n,]+)/i);
        if (modelMatch) {
          model = modelMatch[1].trim().split('\n')[0].split(',')[0];
        } else {
          // Look for alphanumeric patterns like S089, A1234, etc.
          const patternMatch = analysisText.match(/\b([A-Z]\d{3,5}[A-Z]?)\b/);
          if (patternMatch) {
            model = patternMatch[1];
          }
        }
      }

      finalSearchQuery = `${brand} ${model}`.trim();
      
      if (!finalSearchQuery) {
        return {
          statusCode: 400,
          body: JSON.stringify({ 
            error: 'Could not determine product from analysis',
            message: 'Please provide brand and model manually in the form'
          })
        };
      }
    }

    console.log('Searching eBay for:', finalSearchQuery);

    // Build eBay API URL
    const endpoint = 'https://svcs.ebay.com/services/search/FindingService/v1';
    const params = new URLSearchParams({
      'OPERATION-NAME': 'findCompletedItems',
      'SERVICE-VERSION': '1.0.0',
      'SECURITY-APPNAME': ebayAppId,
      'RESPONSE-DATA-FORMAT': 'JSON',
      'REST-PAYLOAD': '',
      'keywords': finalSearchQuery,
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

    // Add the search query to the response so client knows what was searched
    data.searchQuery = finalSearchQuery;

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
