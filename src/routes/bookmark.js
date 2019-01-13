import express from 'express';
import bookmarkController from '../controllers/bookmarkController';
import { verifyToken, checkBookmarkUser } from '../middlewares/authentication';
import checkParams from '../middlewares/checkParams';

const {
  bookmark,
  getAllBookmark,
  unBookmark
} = bookmarkController;

const { idChecker, validateId } = checkParams;

const bookmarkRouter = express.Router();

bookmarkRouter.get('/user/bookmarks', verifyToken, getAllBookmark);
bookmarkRouter.post('/articles/:slug/bookmarks', verifyToken, bookmark);
bookmarkRouter.delete('/user/bookmarks/:id', verifyToken, idChecker, validateId, checkBookmarkUser, unBookmark);

export default bookmarkRouter;
