import { getDb } from '../db/connect.js';

const bookProjection = { _id: 0, id: 1, authorId: 1, title: 1, publicationDate: 1 };

const getAllBooks = async () => {
    return getDb()
        .collection('books')
        .find({}, { projection: bookProjection })
        .toArray();
};

const getBookById = async (bookId) => {
    return getDb()
        .collection('books')
        .findOne({ id: bookId }, { projection: bookProjection });
};

const createBook = async (book) => {
    // insertOne adds _id to the object it receives, so insert a copy.
    return getDb()
        .collection('books')
        .insertOne({ ...book });
};

const updateBook = async (bookId, book) => {
    return getDb()
        .collection('books')
        .updateOne({ id: bookId }, { $set: book });
};

const deleteBook = async (bookId) => {
    return getDb()
        .collection('books')
        .deleteOne({ id: bookId });
};

export { createBook, deleteBook, getAllBooks, getBookById, updateBook };
