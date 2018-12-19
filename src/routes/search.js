import express from 'express';
import searchController from '../controllers/searchController';

const searchRouter = express.Router();

const { searchByAuthor, searchByKeyword, searchByTags } = searchController;

searchRouter.get('/search/author/:author', searchByAuthor);
searchRouter.get('/search/article/:keyword', searchByKeyword);
searchRouter.get('/search/tag/:tagname', searchByTags);

export default searchRouter;
