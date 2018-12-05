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

articlesRouter
  .route('/articles')
  .get(getAllArticles)
  .post(verifyToken, checkInput, createArticle);

articlesRouter
  .route('/articles/:slug')
  .get(verifyToken, slugChecker, getArticle)
  .put(verifyToken, slugChecker, checkUser, updateArticle)
  .delete(verifyToken, slugChecker, checkUser, deleteArticle);

export default articlesRouter;
