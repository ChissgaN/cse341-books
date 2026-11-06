import {
    authorHasBooks,
    createAuthor as createAuthorInDb,
    deleteAuthor as deleteAuthorFromDb,
    getAllAuthors as getAllAuthorsFromDb,
    getAuthorById as getAuthorByIdFromDb,
    updateAuthor as updateAuthorInDb
} from '../models/authors.js';
import { isNonEmptyString } from '../utils/validation.js';

const invalidBirthYearMessage = 'birthYear must be an integer that is not later than the current year';

const isMissing = (value) => {
    return value === undefined || value === null;
};

const isValidBirthYear = (birthYear) => {
    return Number.isInteger(birthYear) && birthYear <= new Date().getFullYear();
};

const getAllAuthors = async (req, res) => {
    try {
        const authors = await getAllAuthorsFromDb();
        return res.status(200).json(authors);
    } catch (error) {
        console.error('Failed to retrieve authors:', error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const getAuthorById = async (req, res) => {
    try {
        const author = await getAuthorByIdFromDb(req.params.id);
        if (!author) {
            return res.status(404).json({ message: 'Author not found' });
        }

        return res.status(200).json(author);
    } catch (error) {
        console.error('Failed to retrieve author:', error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const createAuthor = async (req, res) => {
    try {
        const { id, name, birthYear } = req.body ?? {};

        if (!isNonEmptyString(id) || !isNonEmptyString(name) || isMissing(birthYear)) {
            return res.status(400).json({ message: 'id, name, and birthYear are required' });
        }

        if (!isValidBirthYear(birthYear)) {
            return res.status(400).json({ message: invalidBirthYearMessage });
        }

        const newAuthor = { id: id.trim(), name: name.trim(), birthYear };

        const existingAuthor = await getAuthorByIdFromDb(newAuthor.id);
        if (existingAuthor) {
            return res.status(400).json({ message: 'An author with this id already exists' });
        }

        await createAuthorInDb(newAuthor);

        return res.status(201).json(newAuthor);
    } catch (error) {
        console.error('Failed to create author:', error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const updateAuthor = async (req, res) => {
    try {
        const { name, birthYear } = req.body ?? {};

        if (!isNonEmptyString(name) || isMissing(birthYear)) {
            return res.status(400).json({ message: 'name and birthYear are required' });
        }

        if (!isValidBirthYear(birthYear)) {
            return res.status(400).json({ message: invalidBirthYearMessage });
        }

        const updatedFields = { name: name.trim(), birthYear };
        const result = await updateAuthorInDb(req.params.id, updatedFields);

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Author not found' });
        }

        return res.status(200).json({ id: req.params.id, ...updatedFields });
    } catch (error) {
        console.error('Failed to update author:', error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteAuthor = async (req, res) => {
    try {
        const author = await getAuthorByIdFromDb(req.params.id);
        if (!author) {
            return res.status(404).json({ message: 'Author not found' });
        }

        const hasBooks = await authorHasBooks(req.params.id);
        if (hasBooks) {
            return res.status(409).json({ message: 'Cannot delete an author who still has books' });
        }

        await deleteAuthorFromDb(req.params.id);

        return res.status(204).send();
    } catch (error) {
        console.error('Failed to delete author:', error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export {
    createAuthor,
    deleteAuthor,
    getAllAuthors,
    getAuthorById,
    updateAuthor
};
