import { authorExists } from '../models/authors.js';
import { createBook, deleteBook, getAllBooks, getBookById, updateBook } from '../models/books.js';
import { isNonEmptyString, isValidDateString } from '../utils/validation.js';

const invalidDateMessage = 'publicationDate must be a valid date in YYYY-MM-DD format';
const unknownAuthorMessage = 'authorId does not match an existing author';

const getBooksHandler = async (req, res) => {
    try {
        const books = await getAllBooks();
        return res.status(200).json(books);
    } catch (error) {
        console.error('Failed to retrieve books:', error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const getBookByIdHandler = async (req, res) => {
    try {
        const requestedId = req.params.id;
        const book = await getBookById(requestedId);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        return res.status(200).json(book);
    } catch (error) {
        console.error('Failed to retrieve book:', error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const createBookHandler = async (req, res) => {
    try {
        const { id, authorId, title, publicationDate } = req.body ?? {};

        if (
            !isNonEmptyString(id)
            || !isNonEmptyString(authorId)
            || !isNonEmptyString(title)
            || !isNonEmptyString(publicationDate)
        ) {
            return res.status(400).json({ message: 'id, authorId, title, and publicationDate are required' });
        }

        const newBook = {
            id: id.trim(),
            authorId: authorId.trim(),
            title: title.trim(),
            publicationDate: publicationDate.trim()
        };

        if (!isValidDateString(newBook.publicationDate)) {
            return res.status(400).json({ message: invalidDateMessage });
        }

        const existingBook = await getBookById(newBook.id);
        if (existingBook) {
            return res.status(400).json({ message: 'A book with this id already exists' });
        }

        const authorFound = await authorExists(newBook.authorId);
        if (!authorFound) {
            return res.status(400).json({ message: unknownAuthorMessage });
        }

        await createBook(newBook);

        return res.status(201).json(newBook);
    } catch (error) {
        console.error('Failed to create book:', error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const updateBookHandler = async (req, res) => {
    try {
        const { authorId, title, publicationDate } = req.body ?? {};

        if (
            !isNonEmptyString(authorId)
            || !isNonEmptyString(title)
            || !isNonEmptyString(publicationDate)
        ) {
            return res.status(400).json({ message: 'authorId, title, and publicationDate are required' });
        }

        const updatedFields = {
            authorId: authorId.trim(),
            title: title.trim(),
            publicationDate: publicationDate.trim()
        };

        if (!isValidDateString(updatedFields.publicationDate)) {
            return res.status(400).json({ message: invalidDateMessage });
        }

        const authorFound = await authorExists(updatedFields.authorId);
        if (!authorFound) {
            return res.status(400).json({ message: unknownAuthorMessage });
        }

        const result = await updateBook(req.params.id, updatedFields);
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Book not found' });
        }

        return res.status(200).json({ id: req.params.id, ...updatedFields });
    } catch (error) {
        console.error('Failed to update book:', error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteBookHandler = async (req, res) => {
    try {
        const result = await deleteBook(req.params.id);
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Book not found' });
        }

        return res.status(204).send();
    } catch (error) {
        console.error('Failed to delete book:', error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export {
    createBookHandler,
    deleteBookHandler,
    getBookByIdHandler,
    getBooksHandler,
    updateBookHandler
};
