import express from 'express';
import ArticleController from '../controllers/article';
import verifySlug from '../middlewares/verifySlug';
import { verifyToken, checkUser } from '../middlewares/authentication';
import { checkInput } from '../middlewares/validateArticle';

const articlesRouter = express.Router();

const {
  createArticle,
  getAllArticles,
  updateArticle,
  getArticle,
  deleteArticle
} = ArticleController;

const { slugChecker } = verifySlug;

articlesRouter.get('/articles', getAllArticles);
articlesRouter.get('/articles/:slug', verifyToken, slugChecker, getArticle);
articlesRouter.post('/articles/', verifyToken, checkInput, createArticle);
articlesRouter.put('/articles/:slug', verifyToken, slugChecker, checkUser, updateArticle);
articlesRouter.delete('/articles/:slug', verifyToken, slugChecker, checkUser, deleteArticle);

export default articlesRouter;
