const axios = require('axios');
const cheerio = require('cheerio');
const XLSX = require('xlsx');

// URL of Amazon's Best Sellers in Electronics section
const url = 'https://www.amazon.com/Best-Sellers-Electronics/zgbs/electronics/';

// Function to scrape product details
async function scrapeProducts() {
    try {
        // Send a GET request to the URL
        const response = await axios.get(url);

        // Load the HTML content of the page using cheerio
        const $ = cheerio.load(response.data);

        // Find all the product names and prices
        const products = [];
        $('.a-section.a-spacing-small').each((index, element) => {
            const name = $(element).find('.a-text-normal').text().trim();
            const price = $(element).find('.a-price span.a-offscreen').text().trim();
            products.push({ name, price });
        });

        // Convert product data to Excel format
        const worksheet = XLSX.utils.json_to_sheet(products);

        // Create a new workbook
        const workbook = XLSX.utils.book_new();

        // Add the worksheet to the workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');

        // Write the workbook to an Excel file
        XLSX.writeFile(workbook, 'amazon_top_products.xlsx');

        console.log('Top products data saved to amazon_top_products.xlsx');
    } catch (error) {
        console.error('Error fetching and parsing data:', error);
    }
}

// Call the scrapeProducts function
scrapeProducts();
