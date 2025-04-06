/**
 * data-loader.js - Utility functions for loading and processing data
 */

// Cached data to prevent multiple fetches of the same file
const dataCache = {};

/**
 * Load a CSV file and parse it
 * @param {string} url - URL of the CSV file
 * @returns {Promise<Array>} - Promise resolving to parsed data
 */
async function loadCSV(url) {
  // Return from cache if available
  if (dataCache[url]) {
    return dataCache[url];
  }
  
  try {
    // Fetch the CSV file
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to load CSV: ${response.status} ${response.statusText}`);
    }
    
    const csvText = await response.text();
    
    // Parse CSV using D3
    const parsedData = d3.csvParse(csvText);
    
    // Convert numeric values
    const processedData = parsedData.map(row => {
      const processed = {};
      
      Object.keys(row).forEach(key => {
        // Try to convert to number if possible
        const value = row[key];
        processed[key] = isNaN(Number(value)) ? value : Number(value);
      });
      
      return processed;
    });
    
    // Cache the data
    dataCache[url] = processedData;
    
    return processedData;
  } catch (error) {
    console.error("Error loading CSV data:", error);
    throw error;
  }
}

/**
 * Load a JSON file and parse it
 * @param {string} url - URL of the JSON file
 * @returns {Promise<Object>} - Promise resolving to parsed JSON
 */
async function loadJSON(url) {
  // Return from cache if available
  if (dataCache[url]) {
    return dataCache[url];
  }
  
  try {
    // Fetch the JSON file
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to load JSON: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Cache the data
    dataCache[url] = data;
    
    return data;
  } catch (error) {
    console.error("Error loading JSON data:", error);
    throw error;
  }
}

/**
 * Parse a date value to a consistent format
 * @param {string} dateValue - Date value to parse
 * @param {string} format - Expected date format (e.g., 'YYYY-MM-DD')
 * @returns {Date} - Parsed date object
 */
function parseDate(dateValue, format = 'YYYY-MM-DD') {
  if (!dateValue) return null;
  
  // If it's already a Date object, return it
  if (dateValue instanceof Date) return dateValue;
  
  // Try parsing as ISO date
  let date = new Date(dateValue);
  
  // Check if the date is valid
  if (!isNaN(date.getTime())) {
    return date;
  }
  
  // Handle specific formats if ISO parsing fails
  if (format === 'MM/DD/YYYY') {
    const parts = dateValue.split('/');
    if (parts.length === 3) {
      // Month is 0-indexed in JavaScript Date
      return new Date(parts[2], parts[0] - 1, parts[1]);
    }
  } else if (format === 'DD/MM/YYYY') {
    const parts = dateValue.split('/');
    if (parts.length === 3) {
      return new Date(parts[2], parts[1] - 1, parts[0]);
    }
  }
  
  // Return null for unparseable dates
  console.warn(`Could not parse date: ${dateValue}`);
  return null;
}

/**
 * Calculate statistics for a dataset
 * @param {Array} data - Array of data points
 * @param {string} field - Field to calculate statistics for
 * @returns {Object} - Object containing statistics
 */
function calculateStatistics(data, field) {
  // Extract numeric values for the field
  const values = data
    .map(d => d[field])
    .filter(v => v !== null && v !== undefined && !isNaN(v));
  
  if (values.length === 0) {
    return { min: 0, max: 0, mean: 0, median: 0 };
  }
  
  const min = d3.min(values);
  const max = d3.max(values);
  const mean = d3.mean(values);
  const median = d3.median(values);
  const sum = d3.sum(values);
  
  return { min, max, mean, median, sum };
}

// Export the functions
window.dataLoader = {
  loadCSV,
  loadJSON,
  parseDate,
  calculateStatistics
};