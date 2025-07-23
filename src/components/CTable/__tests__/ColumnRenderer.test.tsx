import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ColumnRenderer from '../ColumnRenderer';

// Mock Arco Design Tag
vi.mock('@arco-design/web-react', () => ({
  Tag: ({ children }: any) => <span data-testid="tag">{children}</span>,
}));

describe('ColumnRenderer', () => {
  it('should render text value', () => {
    render(
      <ColumnRenderer 
        value="test text" 
        record={{}} 
        index={0} 
        valueType="text" 
      />
    );
    
    expect(screen.getByText('test text')).toBeInTheDocument();
  });

  it('should render number value with locale formatting', () => {
    render(
      <ColumnRenderer 
        value={1234.56} 
        record={{}} 
        index={0} 
        valueType="number" 
      />
    );
    
    expect(screen.getByText('1,234.56')).toBeInTheDocument();
  });

  it('should render date value', () => {
    const date = new Date('2023-12-25');
    render(
      <ColumnRenderer 
        value={date} 
        record={{}} 
        index={0} 
        valueType="date" 
      />
    );
    
    expect(screen.getByText('2023/12/25')).toBeInTheDocument();
  });

  it('should render dateTime value', () => {
    const date = new Date('2023-12-25 10:30:00');
    render(
      <ColumnRenderer 
        value={date} 
        record={{}} 
        index={0} 
        valueType="dateTime" 
      />
    );
    
    // The exact format may vary by locale, so we check for the presence of date components
    const text = screen.getByText(/2023.*12.*25.*10.*30/);
    expect(text).toBeInTheDocument();
  });

  it('should render single tag', () => {
    render(
      <ColumnRenderer 
        value="important" 
        record={{}} 
        index={0} 
        valueType="tag" 
      />
    );
    
    expect(screen.getByTestId('tag')).toBeInTheDocument();
    expect(screen.getByText('important')).toBeInTheDocument();
  });

  it('should render multiple tags', () => {
    render(
      <ColumnRenderer 
        value={['tag1', 'tag2', 'tag3']} 
        record={{}} 
        index={0} 
        valueType="tag" 
      />
    );
    
    const tags = screen.getAllByTestId('tag');
    expect(tags).toHaveLength(3);
    expect(screen.getByText('tag1')).toBeInTheDocument();
    expect(screen.getByText('tag2')).toBeInTheDocument();
    expect(screen.getByText('tag3')).toBeInTheDocument();
  });

  it('should render dash for null/undefined values', () => {
    render(
      <ColumnRenderer 
        value={null} 
        record={{}} 
        index={0} 
        valueType="text" 
      />
    );
    
    expect(screen.getByText('-')).toBeInTheDocument();
  });

  it('should handle invalid date strings', () => {
    render(
      <ColumnRenderer 
        value="invalid-date" 
        record={{}} 
        index={0} 
        valueType="date" 
      />
    );
    
    expect(screen.getByText('invalid-date')).toBeInTheDocument();
  });
});
