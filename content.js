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

  // Shared style for unit price cells (used by add and update)
  const UNIT_PRICE_CELL_STYLE = `
    padding: 8px;
    text-align: center;
    font-family: monospace;
    font-weight: bold;
    border: 1px solid rgba(255,255,255,0.05);
  `;

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

    // Add placeholder cells for existing rows (values are filled by updateUnitPriceCells)
    const tbody = table.querySelector('tbody');
    if (tbody) {
      const rows = tbody.querySelectorAll('tr');
      rows.forEach((row) => {
        const cells = row.querySelectorAll('td');
        if (cells.length <= deltaIndex || cells.length <= valueIndex) {
          return;
        }

        const newCell = document.createElement('td');
        newCell.dataset.unitPrice = 'true';
        newCell.style.cssText = UNIT_PRICE_CELL_STYLE;
        row.appendChild(newCell);
      });
    }

    // Fill in the calculated values
    updateUnitPriceCells(table, tableType);
  }

  /**
   * Recalculate and update the values of the unit price column.
   * Handles data changes, newly added rows, and re-rendered table bodies.
   */
  function updateUnitPriceCells(table, tableType) {
    const headers = Array.from(table.querySelectorAll('thead th'));
    const unitPriceIndex = headers.findIndex(h => {
      const text = h.textContent.trim();
      return text.includes('单价') || text.includes('Unit Price');
    });

    if (unitPriceIndex === -1) {
      return;
    }

    const { deltaIndex, valueIndex } = findColumnIndices(table, tableType);
    if (deltaIndex === -1 || valueIndex === -1) {
      return;
    }

    const tbody = table.querySelector('tbody');
    if (!tbody) {
      return;
    }

    const rows = tbody.querySelectorAll('tr');
    rows.forEach((row) => {
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

      const newText = unitPrice !== null ? formatNumber(unitPrice) : '—';
      const newColor = unitPrice !== null
        ? (unitPrice > 0 ? '#52c41a' : unitPrice < 0 ? '#ff4d4f' : 'rgba(255,255,255,0.5)')
        : 'rgba(255,255,255,0.3)';

      // Locate the unit price cell: prefer the marker, fall back to position
      let unitPriceCell = row.querySelector('td[data-unit-price="true"]');
      if (!unitPriceCell && cells.length > unitPriceIndex) {
        unitPriceCell = cells[unitPriceIndex];
      }

      // Newly added row without a unit price cell - append one
      if (!unitPriceCell) {
        unitPriceCell = document.createElement('td');
        unitPriceCell.dataset.unitPrice = 'true';
        unitPriceCell.style.cssText = UNIT_PRICE_CELL_STYLE;
        row.appendChild(unitPriceCell);
      }

      // Only write to the DOM when the displayed value actually changed,
      // so we don't feed mutations back into the observer
      if (unitPriceCell.textContent !== newText) {
        unitPriceCell.textContent = newText;
        unitPriceCell.style.color = newColor;
      }
    });
  }

  /**
   * Debounced function to handle table updates
   */
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  /**
   * Locate the Material IO table and either add the unit price column
   * or recalculate its values. Idempotent, safe to call repeatedly.
   */
  function processTable() {
    const result = findMaterialIOTable();
    if (!result) {
      return;
    }

    if (!hasUnitPriceColumn(result.table)) {
      addUnitPriceColumn(result.table, result.type);
    } else {
      updateUnitPriceCells(result.table, result.type);
    }
  }

  function init() {
    const processTableDebounced = debounce(processTable, CONFIG.debounceDelay);

    // Initial processing
    processTableDebounced();

    // Observe DOM changes - any mutation may indicate the table data changed,
    // so always re-process (debounce keeps this cheap)
    const observer = new MutationObserver(() => {
      processTableDebounced();
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
      processTableDebounced();
      
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
