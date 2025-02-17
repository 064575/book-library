/// <reference types="jest" />
import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { Request, Response } from 'express';
import { getAllBooks, getBookById, createBook, updateBook, deleteBook } from '../bookController';
import { Book } from '../../utils/cache';

// Mock the cache and file system modules
jest.mock('../../utils/cache', () => ({
  initializeCache: jest.fn(() => ({
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn()
  }))
}));

jest.mock('fs/promises', () => ({
  readFile: jest.fn(),
  writeFile: jest.fn()
}));

jest.mock('../../utils/websocket', () => ({
  broadcastMessage: jest.fn()
}));

describe('Book Controller Tests', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis()
    } as Partial<Response>;
    mockNext = jest.fn();
  });

  describe('getAllBooks', () => {
    it('should return paginated books', async () => {
      const mockBooks: Book[] = [
        { id: 1, title: 'Test Book 1', author: 'Author 1', year: 2021, genre: 'Fiction' },
        { id: 2, title: 'Test Book 2', author: 'Author 2', year: 2022, genre: 'Non-fiction' }
      ];

      require('fs/promises').readFile.mockResolvedValue(JSON.stringify(mockBooks));
      mockRequest.query = { page: '1', limit: '10' };

      await getAllBooks(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockBooks,
        pagination: expect.any(Object)
      });
    });
  });

  describe('getBookById', () => {
    it('should return a book by id', async () => {
      const mockBooks: Book[] = [
        { id: 1, title: 'Test Book', author: 'Author', year: 2021, genre: 'Fiction' }
      ];

      require('fs/promises').readFile.mockResolvedValue(JSON.stringify(mockBooks));
      mockRequest.params = { id: '1' };

      await getBookById(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockBooks[0]
      });
    });

    it('should return 404 for non-existent book', async () => {
      const mockBooks: Book[] = [];
      require('fs/promises').readFile.mockResolvedValue(JSON.stringify(mockBooks));
      mockRequest.params = { id: '1' };

      await getBookById(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Knjiga nije pronađena'
      });
    });
  });

  describe('createBook', () => {
    it('should create a new book', async () => {
      const mockBooks: Book[] = [];
      const newBook = {
        title: 'New Book',
        author: 'New Author',
        year: 2023,
        genre: 'Fiction'
      };

      require('fs/promises').readFile.mockResolvedValue(JSON.stringify(mockBooks));
      mockRequest.body = newBook;

      await createBook(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining(newBook)
      });
    });
  });

  describe('updateBook', () => {
    it('should update an existing book', async () => {
      const mockBooks: Book[] = [
        { id: 1, title: 'Old Title', author: 'Old Author', year: 2021, genre: 'Fiction' }
      ];
      const updatedBook = {
        title: 'Updated Title',
        author: 'Updated Author'
      };

      require('fs/promises').readFile.mockResolvedValue(JSON.stringify(mockBooks));
      mockRequest.params = { id: '1' };
      mockRequest.body = updatedBook;

      await updateBook(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining(updatedBook)
      });
    });

    it('should return 404 for updating non-existent book', async () => {
      const mockBooks: Book[] = [];
      require('fs/promises').readFile.mockResolvedValue(JSON.stringify(mockBooks));
      mockRequest.params = { id: '1' };
      mockRequest.body = { title: 'Updated Title' };

      await updateBook(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
    });
  });

  describe('deleteBook', () => {
    it('should delete an existing book', async () => {
      const mockBooks: Book[] = [
        { id: 1, title: 'Test Book', author: 'Author', year: 2021, genre: 'Fiction' }
      ];

      require('fs/promises').readFile.mockResolvedValue(JSON.stringify(mockBooks));
      mockRequest.params = { id: '1' };

      await deleteBook(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Knjiga je uspešno obrisana'
      });
    });

    it('should return 404 for deleting non-existent book', async () => {
      const mockBooks: Book[] = [];
      require('fs/promises').readFile.mockResolvedValue(JSON.stringify(mockBooks));
      mockRequest.params = { id: '1' };

      await deleteBook(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
    });
  });
}); 