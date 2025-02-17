// Interfejs za knjigu
export interface Book {
  id: number;
  title: string;
  author: string;
  year: number;
  genre: string;
}

// Interfejs za paginaciju
export interface Pagination {
  total: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// Props za BookList komponentu
export interface BookListProps {
  books: Book[];
  loading: boolean;
  pagination: Pagination;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onBookUpdated: () => Promise<void>;
  onBookDeleted: () => Promise<void>;
}

// Props za BookForm komponentu
export interface BookFormProps {
  book?: Book;
  onBookAdded: () => Promise<void>;
  onCancel?: () => void;
}

// Props za FileUpload komponentu
export interface FileUploadProps {
  onUploadSuccess: () => Promise<void>;
}

// Props za BookCard komponentu
export interface BookCardProps {
  book: Book;
  onUpdate: () => Promise<void>;
  onDelete: () => Promise<void>;
}

// Tip za API odgovor
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  pagination?: Pagination;
  error?: string;
  message?: string;
} 