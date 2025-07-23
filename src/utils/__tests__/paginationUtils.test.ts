import { describe, it, expect } from 'vitest';
import {
  processPaginationConfig,
  validatePaginationParams,
  calculatePaginationInfo,
  getCurrentPageData,
} from '../paginationUtils';

describe('paginationUtils', () => {
  describe('processPaginationConfig', () => {
    it('should return false when pagination is false', () => {
      const result = processPaginationConfig(false, 100);
      expect(result).toBe(false);
    });

    it('should return default config when pagination is undefined', () => {
      const result = processPaginationConfig(undefined, 100);
      expect(result).toEqual({
        current: 1,
        pageSize: 10,
        total: 100,
        sizeCanChange: true,
        sizeOptions: [10, 20, 50, 100],
        showTotal: expect.any(Function),
        showJumper: true,
      });
    });

    it('should merge custom config with defaults', () => {
      const customConfig = {
        current: 2,
        pageSize: 20,
        sizeCanChange: false,
      };

      const result = processPaginationConfig(customConfig, 100);
      expect(result).toEqual({
        current: 2,
        pageSize: 20,
        total: 100,
        sizeCanChange: false,
        sizeOptions: [10, 20, 50, 100],
        showTotal: expect.any(Function),
        showJumper: true,
      });
    });

    it('should use custom total when provided', () => {
      const customConfig = {
        total: 200,
      };

      const result = processPaginationConfig(customConfig, 100);
      expect(result.total).toBe(200);
    });
  });

  describe('validatePaginationParams', () => {
    it('should return valid for correct params', () => {
      const result = validatePaginationParams(1, 10, 100);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return errors for invalid current page', () => {
      const result = validatePaginationParams(0, 10, 100);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('当前页码不能小于1');
    });

    it('should return errors for invalid page size', () => {
      const result = validatePaginationParams(1, 0, 100);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('页面大小不能小于1');
    });

    it('should return errors for invalid total', () => {
      const result = validatePaginationParams(1, 10, -1);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('总数不能小于0');
    });

    it('should return errors for current page exceeding max page', () => {
      const result = validatePaginationParams(11, 10, 100); // max page is 10
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('当前页码不能大于最大页码 10');
    });
  });

  describe('calculatePaginationInfo', () => {
    it('should calculate correct pagination info', () => {
      const result = calculatePaginationInfo(2, 10, 100);
      expect(result).toEqual({
        current: 2,
        pageSize: 10,
        total: 100,
        maxPage: 10,
        startIndex: 10,
        endIndex: 19,
        hasNext: true,
        hasPrev: true,
      });
    });

    it('should handle first page', () => {
      const result = calculatePaginationInfo(1, 10, 100);
      expect(result.hasPrev).toBe(false);
      expect(result.hasNext).toBe(true);
      expect(result.startIndex).toBe(0);
      expect(result.endIndex).toBe(9);
    });

    it('should handle last page', () => {
      const result = calculatePaginationInfo(10, 10, 100);
      expect(result.hasPrev).toBe(true);
      expect(result.hasNext).toBe(false);
      expect(result.startIndex).toBe(90);
      expect(result.endIndex).toBe(99);
    });

    it('should handle partial last page', () => {
      const result = calculatePaginationInfo(3, 10, 25);
      expect(result.maxPage).toBe(3);
      expect(result.startIndex).toBe(20);
      expect(result.endIndex).toBe(24);
      expect(result.hasNext).toBe(false);
    });

    it('should correct current page if it exceeds max page', () => {
      const result = calculatePaginationInfo(15, 10, 100); // max page is 10
      expect(result.current).toBe(10);
    });
  });

  describe('getCurrentPageData', () => {
    const mockData = Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      name: `Item ${i + 1}`,
    }));

    it('should return correct page data', () => {
      const result = getCurrentPageData(mockData, 1, 10);
      expect(result).toHaveLength(10);
      expect(result[0]).toEqual({ id: 1, name: 'Item 1' });
      expect(result[9]).toEqual({ id: 10, name: 'Item 10' });
    });

    it('should return correct second page data', () => {
      const result = getCurrentPageData(mockData, 2, 10);
      expect(result).toHaveLength(10);
      expect(result[0]).toEqual({ id: 11, name: 'Item 11' });
      expect(result[9]).toEqual({ id: 20, name: 'Item 20' });
    });

    it('should return partial data for last page', () => {
      const result = getCurrentPageData(mockData, 3, 10);
      expect(result).toHaveLength(5);
      expect(result[0]).toEqual({ id: 21, name: 'Item 21' });
      expect(result[4]).toEqual({ id: 25, name: 'Item 25' });
    });

    it('should return empty array for page beyond data', () => {
      const result = getCurrentPageData(mockData, 10, 10);
      expect(result).toHaveLength(0);
    });
  });
});
