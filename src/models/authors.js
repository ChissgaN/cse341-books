import { getDb } from '../db/connect.js';

const authorProjection = { _id: 0, id: 1, name: 1, birthYear: 1 };

const getAllAuthors = async () => {
    const db = getDb();
    const collection = db.collection('authors');
    const authors = await collection.find({}, { projection: authorProjection }).toArray();

    return authors;
};

const getAuthorById = async (id) => {
    const db = getDb();
    const collection = db.collection('authors');
    const author = await collection.findOne({ id }, { projection: authorProjection });

    return author;
};

const createAuthor = async (author) => {
    const db = getDb();
    const collection = db.collection('authors');

    // insertOne adds _id to the object it receives, so insert a copy.
    return collection.insertOne({ ...author });
};

const updateAuthor = async (id, author) => {
    const db = getDb();
    const collection = db.collection('authors');

    return collection.updateOne({ id }, { $set: author });
};

const deleteAuthor = async (id) => {
    const db = getDb();
    const collection = db.collection('authors');

    return collection.deleteOne({ id });
};

const authorHasBooks = async (id) => {
    const db = getDb();
    const collection = db.collection('books');
    const book = await collection.findOne({ authorId: id }, { projection: { _id: 1 } });

    return book !== null;
};

const authorExists = async (id) => {
    const db = getDb();
    const collection = db.collection('authors');
    const author = await collection.findOne({ id }, { projection: { _id: 1 } });

    return author !== null;
};

export {
    authorExists,
    authorHasBooks,
    createAuthor,
    deleteAuthor,
    getAllAuthors,
    getAuthorById,
    updateAuthor
};
