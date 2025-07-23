import { describe, it, expect } from 'vitest';
import * as ComponentLibrary from '../index';

describe('Component Library Exports', () => {
  it('should export main CTable component', () => {
    expect(ComponentLibrary.CTable).toBeDefined();
    expect(typeof ComponentLibrary.CTable).toBe('function');
  });

  it('should export sub-components', () => {
    expect(ComponentLibrary.CTableErrorBoundary).toBeDefined();
    expect(ComponentLibrary.SearchForm).toBeDefined();
    expect(ComponentLibrary.TableToolbar).toBeDefined();
    expect(ComponentLibrary.ColumnRenderer).toBeDefined();
  });

  it('should export utility functions', () => {
    // Column utils
    expect(ComponentLibrary.validateColumns).toBeDefined();
    expect(ComponentLibrary.transformColumns).toBeDefined();
    expect(ComponentLibrary.generateSearchConfig).toBeDefined();
    expect(ComponentLibrary.getDefaultRenderer).toBeDefined();
    expect(ComponentLibrary.createSorter).toBeDefined();

    // Search utils
    expect(ComponentLibrary.validateSearchConfig).toBeDefined();
    expect(ComponentLibrary.processSearchValues).toBeDefined();
    expect(ComponentLibrary.resetSearchValues).toBeDefined();
    expect(ComponentLibrary.getInitialSearchValues).toBeDefined();
    expect(ComponentLibrary.validateSearchValues).toBeDefined();

    // Pagination utils
    expect(ComponentLibrary.processPaginationConfig).toBeDefined();
    expect(ComponentLibrary.validatePaginationParams).toBeDefined();
    expect(ComponentLibrary.calculatePaginationInfo).toBeDefined();
    expect(ComponentLibrary.getCurrentPageData).toBeDefined();
  });

  it('should have correct function types', () => {
    expect(typeof ComponentLibrary.validateColumns).toBe('function');
    expect(typeof ComponentLibrary.validateSearchConfig).toBe('function');
    expect(typeof ComponentLibrary.processPaginationConfig).toBe('function');
  });
});
