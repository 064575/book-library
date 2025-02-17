import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import BookList from '../BookList';
import { Book, Pagination } from '../../types';

const mockBooks: Book[] = [
  {
    id: 1,
    title: 'Test Book 1',
    author: 'Test Author 1',
    year: 2021,
    genre: 'Fiction'
  },
  {
    id: 2,
    title: 'Test Book 2',
    author: 'Test Author 2',
    year: 2022,
    genre: 'Non-fiction'
  }
];

const mockPagination: Pagination = {
  total: 2,
  totalPages: 1,
  currentPage: 1,
  limit: 10,
  hasNext: false,
  hasPrevious: false
};

describe('BookList Component', () => {
  const mockProps = {
    books: mockBooks,
    loading: false,
    pagination: mockPagination,
    onPageChange: jest.fn(),
    onLimitChange: jest.fn(),
    onBookUpdated: jest.fn(),
    onBookDeleted: jest.fn()
  };

  it('renders loading state', () => {
    render(<BookList {...mockProps} loading={true} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders empty state', () => {
    render(<BookList {...mockProps} books={[]} />);
    expect(screen.getByText('Nema dostupnih knjiga')).toBeInTheDocument();
  });

  it('renders book list', () => {
    render(<BookList {...mockProps} />);
    expect(screen.getByText('Test Book 1')).toBeInTheDocument();
    expect(screen.getByText('Test Book 2')).toBeInTheDocument();
    expect(screen.getByText(/Autor: Test Author 1/)).toBeInTheDocument();
    expect(screen.getByText(/Autor: Test Author 2/)).toBeInTheDocument();
  });

  it('handles page change', () => {
    const paginatedProps = {
      ...mockProps,
      pagination: {
        ...mockPagination,
        totalPages: 3,
        currentPage: 1,
        hasNext: true,
        hasPrevious: false
      }
    };
    render(<BookList {...paginatedProps} />);
    const nextPageButton = screen.getByRole('button', { name: /Go to next page/i });
    expect(nextPageButton).not.toBeDisabled();
    fireEvent.click(nextPageButton);
    expect(mockProps.onPageChange).toHaveBeenCalled();
  });

  it('handles items per page change', () => {
    render(<BookList {...mockProps} />);
    const select = screen.getByRole('combobox');
    fireEvent.mouseDown(select);
    const option = screen.getByRole('option', { name: '20' });
    fireEvent.click(option);
    expect(mockProps.onLimitChange).toHaveBeenCalledWith(20);
  });

  it('displays total books count', () => {
    render(<BookList {...mockProps} />);
    expect(screen.getByText('Ukupno: 2 knjiga')).toBeInTheDocument();
  });
}); 