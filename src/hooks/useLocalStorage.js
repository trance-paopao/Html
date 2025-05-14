/**
 * Custom hook for localStorage functionality
 * This simulates a React custom hook in plain JavaScript
 */

// Get item from localStorage with expiry check
function getStorageItem(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    
    if (item === null) {
      return defaultValue;
    }
    
    // Try to parse the item
    const parsedItem = JSON.parse(item);
    
    // Check if the item has expiry
    if (parsedItem && parsedItem.expiry && parsedItem.value) {
      const now = new Date().getTime();
      
      if (now > parsedItem.expiry) {
        // Item has expired, remove it
        localStorage.removeItem(key);
        return defaultValue;
      }
      
      // Return just the value
      return parsedItem.value;
    }
    
    // Return the parsed item if no expiry structure
    return parsedItem;
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
}

// Set item in localStorage with optional expiry time
function setStorageItem(key, value, expiryInMinutes = null) {
  try {
    // If expiry is provided, store with expiry time
    if (expiryInMinutes !== null) {
      const now = new Date().getTime();
      const expiryTime = now + (expiryInMinutes * 60 * 1000);
      
      const itemWithExpiry = {
        value: value,
        expiry: expiryTime
      };
      
      localStorage.setItem(key, JSON.stringify(itemWithExpiry));
    } else {
      // Store without expiry
      localStorage.setItem(key, JSON.stringify(value));
    }
    
    return true;
  } catch (error) {
    console.error(`Error setting localStorage key "${key}":`, error);
    return false;
  }
}

// Remove item from localStorage
function removeStorageItem(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error);
    return false;
  }
}

// Clear all localStorage items
function clearStorage() {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error("Error clearing localStorage:", error);
    return false;
  }
}

// Track user activity and cache it
function trackUserActivity(action, data = {}) {
  try {
    const activities = getStorageItem('userActivities', []);
    
    // Add new activity
    activities.push({
      action,
      data,
      timestamp: new Date().toISOString()
    });
    
    // Keep only the latest 50 activities to save space
    if (activities.length > 50) {
      activities.shift();
    }
    
    // Save back to storage with 7 day expiry
    setStorageItem('userActivities', activities, 60 * 24 * 7); // 7 days
    
    return true;
  } catch (error) {
    console.error("Error tracking user activity:", error);
    return false;
  }
}

// Get cached data or fetch from "API"
async function getCachedData(key, fetchFunction, expiryInMinutes = 30) {
  // Try to get from cache first
  const cachedData = getStorageItem(key);
  
  if (cachedData !== null) {
    return cachedData;
  }
  
  // If not in cache, fetch the data
  try {
    const data = await fetchFunction();
    
    // Cache the result
    setStorageItem(key, data, expiryInMinutes);
    
    return data;
  } catch (error) {
    console.error(`Error fetching data for key "${key}":`, error);
    throw error;
  }
}

// Export the functions
export {
  getStorageItem,
  setStorageItem,
  removeStorageItem,
  clearStorage,
  trackUserActivity,
  getCachedData
}; 