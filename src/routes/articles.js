import express from 'express';
import ArticleController from '../controllers/article';
import Comment from '../controllers/comment';
import { rateArticle } from '../controllers/ratingController';
import FavoriteArticleController from '../controllers/favoriteArticleController';
import HighLightedText from '../controllers/HighLightedText';
import { validateInput } from '../middlewares/helper';

import verifySlug from '../middlewares/verifySlug';
import { verifyToken, checkUser, checkAuthStatus } from '../middlewares/authentication';
import checkInput from '../middlewares/validateArticle';
import articleRatingValidatior from '../middlewares/validateRating';

import PaginationHelper from '../helpers/paginationHelper';
import ReportArticle from '../controllers/reportArticle';
import CommentReaction from '../controllers/commentReaction';

import { getReadStatistics } from '../controllers/statisticsController';
import articleStatsValidatior from '../middlewares/validateStatistics';

const articlesRouter = express.Router();

const {
  createArticle,
  getAllArticles,
  updateArticle,
  getArticle,
  deleteArticle
} = ArticleController;

const { favoriteArticle, unfavoriteArticle } = FavoriteArticleController;

const { slugChecker } = verifySlug;

const articlesBaseEndpoint = '/articles';

const { checkQueryparameter } = PaginationHelper;

const { likeOrUnlikeOneComment } = CommentReaction;

articlesRouter
  .route(articlesBaseEndpoint)
  .get(checkAuthStatus, checkQueryparameter, getAllArticles)
  .post(verifyToken, checkInput, createArticle);

articlesRouter
  .route(`${articlesBaseEndpoint}/:slug`)
  .get(checkAuthStatus, slugChecker, getArticle)
  .put(verifyToken, slugChecker, checkUser, updateArticle)
  .delete(verifyToken, slugChecker, checkUser, deleteArticle);

articlesRouter
  .route(`${articlesBaseEndpoint}/:slug/rating`)
  .post(verifyToken, slugChecker, articleRatingValidatior, rateArticle);

articlesRouter
  .route(`${articlesBaseEndpoint}/:slug/statistics`)
  .get(verifyToken, slugChecker, articleStatsValidatior, getReadStatistics);

articlesRouter
  .route(`${articlesBaseEndpoint}/:slug/comments`)
  .get(slugChecker, Comment.getAll)
  .post(verifyToken, slugChecker, Comment.create);

articlesRouter
  .route(`${articlesBaseEndpoint}/:slug/comments/:commentId`)
  .get(slugChecker, Comment.getOneValidator, Comment.getOne)
  .put(verifyToken, slugChecker, Comment.update);

articlesRouter
  .route(`${articlesBaseEndpoint}/:slug/comments`)
  .get(slugChecker, Comment.getAll)
  .post(verifyToken, slugChecker, Comment.create);

articlesRouter
  .route(`${articlesBaseEndpoint}/:slug/report`)
  .post(verifyToken, slugChecker, ReportArticle.report);

articlesRouter
  .route(`${articlesBaseEndpoint}/:slug/favorite`)
  .post(verifyToken, slugChecker, favoriteArticle)
  .delete(verifyToken, slugChecker, unfavoriteArticle);

articlesRouter
  .route(`${articlesBaseEndpoint}/:slug/comments/highlight-text`)
  .post(verifyToken, validateInput, HighLightedText.createComment);

articlesRouter
  .route(`${articlesBaseEndpoint}/:slug/comments/:commentId/reaction`)
  .post(verifyToken, slugChecker, Comment.getOneValidator, likeOrUnlikeOneComment);

export default articlesRouter;
