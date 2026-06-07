/**
 * PRUNplanner Unit Price Calculator - Content Script
 * 
 * This script automatically adds a "Unit Price" column to the Empire Material IO table
 * Unit Price = deltaPrice / delta (利润差值 / 差值)
 */

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    // Column header text (supports multiple languages)
    columnHeader: '单价\nUnit Price',
    // Number of decimal places for unit price
    decimalPlaces: 2,
    // Retry configuration for DOM observation
    retryInterval: 1000,
    maxRetries: 30,
    // Debounce delay for table updates
    debounceDelay: 500
  };

  /**
   * Format number with locale and decimal places
   */
  function formatNumber(num, decimals = CONFIG.decimalPlaces) {
    if (num === undefined || num === null || isNaN(num)) {
      return '—';
    }
    return num.toLocaleString('zh-CN', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  }

  /**
   * Calculate unit price from deltaPrice and delta
   */
  function calculateUnitPrice(deltaPrice, delta) {
    if (!delta || delta === 0) {
      return null;
    }
    return deltaPrice / delta;
  }

  /**
   * Find the Empire Material IO table or Plan Material IO table
   * Uses multiple strategies to locate the table
   */
  function findMaterialIOTable() {
    // Strategy 1: Look for table containing both "差值" and "利润差值" headers (Empire table)
    const allTables = document.querySelectorAll('table');
    
    for (const table of allTables) {
      const headers = Array.from(table.querySelectorAll('th'));
      const headerTexts = headers.map(h => h.textContent.trim());
      
      // Check if table has both delta and delta_price columns (Empire table)
      const hasDelta = headerTexts.some(text => 
        text === '差值' || 
        text === 'delta' || 
        text === 'Δ' ||
        text.toLowerCase().includes('delta')
      );
      const hasDeltaPrice = headerTexts.some(text => 
        text === '利润差值' || 
        text === 'deltaPrice' || 
        text.toLowerCase().includes('deltaprice')
      );
      
      if (hasDelta && hasDeltaPrice) {
        return { table, type: 'empire' };
      }
      
      // Check if table has delta and cost/day columns (Plan table)
      const hasCostDay = headerTexts.some(text => 
        text.includes('ȼ') || 
        text.includes('天') ||
        (text.toLowerCase().includes('cost') && text.toLowerCase().includes('day'))
      );
      
      if (hasDelta && hasCostDay) {
        return { table, type: 'plan' };
      }
    }
    
    // Strategy 2: Look for table with specific data attributes or classes
    const dataTable = document.querySelector('[class*="data-table"], [class*="DataTable"]');
    if (dataTable) {
      const headers = Array.from(dataTable.querySelectorAll('th'));
      const headerTexts = headers.map(h => h.textContent.trim());
      
      if (headerTexts.some(text => text.includes('差值') || text.toLowerCase().includes('delta'))) {
        const hasDeltaPrice = headerTexts.some(text => 
          text === '利润差值' || text.toLowerCase().includes('deltaprice')
        );
        return {
          table: dataTable,
          type: hasDeltaPrice ? 'empire' : 'plan'
        };
      }
    }
    
    return null;
  }

  /**
   * Find column indices based on table type
   */
  function findColumnIndices(table, tableType) {
    const headers = Array.from(table.querySelectorAll('thead th'));
    let deltaIndex = -1;
    let valueIndex = -1; // deltaPrice for empire, price for plan
    
    headers.forEach((header, index) => {
      const text = header.textContent.trim().toLowerCase();
      const originalText = header.textContent.trim();
      
      // Find delta column (差值, Δ, delta)
      if (deltaIndex === -1 && (
        originalText === '差值' || 
        originalText === 'Δ' ||
        originalText === 'delta' ||
        text.includes('delta')
      )) {
        deltaIndex = index;
      }
      
      if (tableType === 'empire') {
        // Find deltaPrice column (利润差值)
        if (valueIndex === -1 && (
          originalText === '利润差值' || 
          text.includes('deltaprice')
        )) {
          valueIndex = index;
        }
      } else {
        // Find price column (ȼ / 天 or cost/day)
        if (valueIndex === -1 && (
          originalText.includes('ȼ') || 
          (text.includes('cost') && text.includes('day'))
        )) {
          valueIndex = index;
        }
      }
    });
    
    return { deltaIndex, valueIndex };
  }

  /**
   * Check if unit price column already exists
   */
  function hasUnitPriceColumn(table) {
    const headers = Array.from(table.querySelectorAll('thead th'));
    return headers.some(h => {
      const text = h.textContent.trim();
      return text.includes('单价') || text.includes('Unit Price');
    });
  }

  /**
   * Add unit price column to the table
   */
  function addUnitPriceColumn(table, tableType = 'empire') {
    if (hasUnitPriceColumn(table)) {
      return;
    }

    const { deltaIndex, valueIndex } = findColumnIndices(table, tableType);
    
    if (deltaIndex === -1 || valueIndex === -1) {
      return;
    }



    // Add header
    const thead = table.querySelector('thead tr');
    if (thead) {
      const headerCell = document.createElement('th');
      headerCell.textContent = CONFIG.columnHeader;
      headerCell.style.cssText = `
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        font-weight: bold;
        padding: 12px 8px;
        text-align: center;
        white-space: pre-line;
        font-size: 12px;
        border: 1px solid rgba(255,255,255,0.1);
      `;
      thead.appendChild(headerCell);
    }

    // Add data cells
    const tbody = table.querySelector('tbody');
    if (!tbody) {
      return;
    }

    const rows = tbody.querySelectorAll('tr');
    let processedCount = 0;

    rows.forEach((row, rowIndex) => {
      const cells = row.querySelectorAll('td');
      if (cells.length <= deltaIndex || cells.length <= valueIndex) {
        return;
      }

      const deltaCell = cells[deltaIndex];
      const valueCell = cells[valueIndex];

      if (!deltaCell || !valueCell) {
        return;
      }

      // Extract numeric values from cells
      const deltaText = deltaCell.textContent.trim();
      const valueText = valueCell.textContent.trim();

      // Parse numbers (remove commas and other formatting)
      const delta = parseFloat(deltaText.replace(/,/g, ''));
      const value = parseFloat(valueText.replace(/,/g, ''));

      // Calculate unit price
      const unitPrice = calculateUnitPrice(value, delta);

      // Create new cell
      const newCell = document.createElement('td');
      newCell.style.cssText = `
        padding: 8px;
        text-align: center;
        font-family: monospace;
        font-weight: bold;
        border: 1px solid rgba(255,255,255,0.05);
      `;

      if (unitPrice !== null) {
        newCell.textContent = formatNumber(unitPrice);
        
        // Color coding based on value
        if (unitPrice > 0) {
          newCell.style.color = '#52c41a'; // Green for positive
        } else if (unitPrice < 0) {
          newCell.style.color = '#ff4d4f'; // Red for negative
        } else {
          newCell.style.color = 'rgba(255,255,255,0.5)';
        }
      } else {
        newCell.textContent = '—';
        newCell.style.color = 'rgba(255,255,255,0.3)';
      }

      row.appendChild(newCell);
      processedCount++;
    });
  }

  /**
   * Debounced function to handle table updates
   */
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  function init() {
    const processTable = debounce(() => {
      const result = findMaterialIOTable();
      if (result) {
        addUnitPriceColumn(result.table, result.type);
      }
    }, CONFIG.debounceDelay);

    // Initial processing
    processTable();

    // Observe DOM changes
    const observer = new MutationObserver((mutations) => {
      let shouldProcess = false;
      
      for (const mutation of mutations) {
        if (mutation.addedNodes.length > 0 || 
            mutation.type === 'characterData' ||
            mutation.attributeName === 'class') {
          shouldProcess = true;
          break;
        }
      }
      
      if (shouldProcess) {
        processTable();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true
    });

    // Retry mechanism for late-loading tables
    let retryCount = 0;
    const retryInterval = setInterval(() => {
      const result = findMaterialIOTable();
      if (result && !hasUnitPriceColumn(result.table)) {
        addUnitPriceColumn(result.table, result.type);
      }
      
      retryCount++;
      if (retryCount >= CONFIG.maxRetries) {
        clearInterval(retryInterval);
      }
    }, CONFIG.retryInterval);

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
      observer.disconnect();
      clearInterval(retryInterval);
    });
  }

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
