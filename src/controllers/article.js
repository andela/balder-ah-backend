import Slug from 'slug';
import ArticleModel from '../helpers/articles';
import { articleAverageRating } from './ratingController';
import TagHelpers from '../helpers/tagHelpers';
import FavoriteModelHelper from '../helpers/favorite';
import { hasReadArticle } from './statisticsController';
import logTracker from '../../logger/logTraker';

const errorMessage = 'Could not complete action at this time';

/**
 * @description class representing Article Controller
 * @class ArticleController
 */
class ArticleController {
  /**
   * @description - This method is responsible for creating new articles
   * @static
   * @param {object} request - Request sent to the router
   * @param {object} response - Response sent from the controller
   * @returns {object} - object representing response message
   * @memberof ArticleController
   */
  static async createArticle(request, response) {
    const {
      title,
      description,
      body,
      tags
    } = request.body;
    const userId = request.userData.payload.id;
    try {
      const tagResponse = await TagHelpers.addNewTag(tags);
      const slugGen = Slug(`${title} ${Date.now()}`);
      const newArticle = await ArticleModel.createArticle({
        slug: slugGen,
        title,
        description,
        body,
        userId
      });
      await newArticle.setTags(tagResponse);
      return response.status(201).json({
        status: 'Success',
        message: 'Article created successfully',
        newArticle,
      });
    } catch (error) {
      logTracker(error);
      return response.status(500).json({
        status: 'Fail',
        message: errorMessage
      });
    }
  }

  /**
   * @description - This method is responsible for fetching all articles
   * @static
   * @param {object} request - Request sent to the router
   * @param {object} response - Response sent from the controller
   * @returns {object} - object representing response message
   * @memberof ArticleController
   */
  static async getAllArticles(request, response) {
    try {
      const { page } = request.query;
      let allArticles = await ArticleModel.getAllArticle(page);
      if (!allArticles.length) {
        return response.status(404).json({
          status: 'Fail',
          message: 'No article found'
        });
      }
      allArticles = allArticles.map((article) => {
        article = article.toJSON();
        article.tags = article.tags.map(tagname => tagname.name);
        article.favoritesCount = article.favoritesCount.length;
        return article;
      });
      return response.status(200).json({
        status: 'Success',
        message: 'All articles found successfully',
        allArticles
      });
    } catch (error) {
      logTracker(error);
      return response.status(500).json({
        status: 'Fail',
        message: errorMessage
      });
    }
  }

  /**
   * @description - This method is responsible for updating existing articles
   * @static
   * @param {object} request - Request sent to the router
   * @param {object} response - Response sent from the controller
   * @returns {object} - object representing response message
   * @memberof ArticleController
   */
  static async updateArticle(request, response) {
    const articleSlug = request.params.slug;
    const findArticle = await ArticleModel.queryForArticle(articleSlug);
    if (!findArticle) {
      return response.status(404).json({
        status: 'Fail',
        message: 'Article not found'
      });
    }
    await ArticleModel.update(request, response, findArticle, articleSlug);
  }

  /**
   * @description - This method is responsible for creating fetching one article
   * @static
   * @param {object} request - Request sent to the router
   * @param {object} response - Response sent from the controller
   * @returns {object} - object representing response message
   * @memberof ArticleController
   */
  static async getArticle(request, response) {
    const articleSlug = request.params.slug;
    const { isLoggedIn } = request;
    try {
      const getOneArticle = (await ArticleModel.getOneArticle(articleSlug)).toJSON();

      getOneArticle.tags = getOneArticle.tags.map(tagname => tagname.name);
      getOneArticle.favoritesCount = getOneArticle.favoritesCount.length;
      getOneArticle.favorited = isLoggedIn ? await FavoriteModelHelper
        .hasBeenFavorited(getOneArticle.id, request.userData.payload.id)
        : false;

      getOneArticle.articleRatingStar = await articleAverageRating(request);
      await hasReadArticle(request, getOneArticle.author.username);

      return response.status(200).json({
        status: 'Success',
        message: 'Article found successfully',
        getOneArticle
      });
    } catch (error) {
      logTracker(error);
      return response.status(500).json({
        status: 'Fail',
        message: errorMessage
      });
    }
  }

  /**
   * @description - This method is responsible for deleting an existing article
   * @static
   * @param {object} request - Request sent to the router
   * @param {object} response - Response sent from the controller
   * @returns {void} - void representing response message
   * @memberof ArticleController
   */
  static async deleteArticle(request, response) {
    const articleSlug = request.params.slug;
    const findArticle = await ArticleModel.queryForArticle(articleSlug);
    if (!findArticle) {
      return response.status(404).json({
        status: 'Fail',
        message: 'Article not found'
      });
    }
    try {
      await ArticleModel.delete(articleSlug);
      return response.status(200).json({
        status: 'Success',
        message: 'Article deleted successfully'
      });
    } catch (error) {
      logTracker(error);
      return response.status(500).json({
        status: 'Fail',
        message: errorMessage
      });
    }
  }
}

export default ArticleController;
