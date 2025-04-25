const { default: SummaryApi } = require("../common")

const fetchCategoryWiseProduct = async(category) => {
    try {
        if (!category) {
            throw new Error('Category parameter is required');
        }

        const response = await fetch(SummaryApi.fetchCategoryWiseProduct.url, {
            method: SummaryApi.fetchCategoryWiseProduct.method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                category: category
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const dataResponse = await response.json();
        
        if (!dataResponse.success && dataResponse.error) {
            throw new Error(dataResponse.message || 'Failed to fetch category products');
        }

        return dataResponse;
    } catch (error) {
        console.error('Error in fetchCategoryWiseProduct:', error);
        throw error;
    }
}

export default fetchCategoryWiseProduct