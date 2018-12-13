import express from 'express';
import ArticleController from '../controllers/article';
import Comment from '../controllers/comment';
import { rateArticle } from '../controllers/articleRatingController';

import verifySlug from '../middlewares/verifySlug';
import { verifyToken, checkUser } from '../middlewares/authentication';
import checkInput from '../middlewares/validateArticle';
import articleRatingValidatior from '../middlewares/validateRating';
import PaginationHelper from '../helpers/paginationHelper';

const articlesRouter = express.Router();

const {
  createArticle,
  getAllArticles,
  updateArticle,
  getArticle,
  deleteArticle
} = ArticleController;

const { slugChecker } = verifySlug;

const articlesBaseEndpoint = '/articles';

const { checkQueryparameter } = PaginationHelper;

articlesRouter
  .route(articlesBaseEndpoint)
  .get(checkQueryparameter, getAllArticles)
  .post(verifyToken, checkInput, createArticle);

articlesRouter
  .route(`${articlesBaseEndpoint}/:slug`)
  .get(verifyToken, slugChecker, getArticle)
  .put(verifyToken, slugChecker, checkUser, updateArticle)
  .delete(verifyToken, slugChecker, checkUser, deleteArticle)
  .post(verifyToken, slugChecker, articleRatingValidatior, rateArticle);

articlesRouter
  .route(`${articlesBaseEndpoint}/:slug/comments`)
  .get(slugChecker, Comment.getAll)
  .post(verifyToken, slugChecker, Comment.create);

articlesRouter
  .route(`${articlesBaseEndpoint}/:slug/comments/:commentId`)
  .get([slugChecker, Comment.getOne]);

articlesRouter
  .route(`${articlesBaseEndpoint}/:slug/comments`)
  .get(slugChecker, Comment.getAll)
  .post(verifyToken, slugChecker, Comment.create);

articlesRouter
  .route(`${articlesBaseEndpoint}/:slug/comments/:commentId`)
  .get([slugChecker, Comment.getOne]);

export default articlesRouter;
