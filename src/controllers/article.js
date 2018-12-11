import Slug from 'slug';
import ArticleModel from '../helpers/articles';
import { articleAverageRating } from './articleRatingController';

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
    const { title, description, body } = request.body;
    const userId = request.userData.payload.id;
    try {
      const slugGen = Slug(`${title} ${Date.now()}`);
      const newArticle = await ArticleModel.createArticle({
        slug: slugGen,
        title,
        description,
        body,
        userId
      });
      return response.status(201).json({
        status: 'Success',
        message: 'Article created successfully',
        newArticle
      });
    } catch (error) {
      return response.status(500).json({
        status: 'Fail',
        error: error.message
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
      const allArticles = await ArticleModel.getAllArticle(page);
      if (!allArticles.length) {
        return response.status(404).json({
          status: 'Fail',
          message: 'No article found'
        });
      }
      return response.status(200).json({
        status: 'Success',
        message: 'All articles found successfully',
        allArticles
      });
    } catch (error) {
      return response.status(500).json({
        status: 'Fail',
        error: error.message
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
    ArticleModel.update(request, response, findArticle, articleSlug);
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
    try {
      const getOneArticle = await ArticleModel.getOneArticle(articleSlug);
      const articleRatingStar = await articleAverageRating(request);

      return response.status(200).json({
        status: 'Success',
        message: 'Article found successfully',
        getOneArticle,
        articleRatingStar
      });
    } catch (error) {
      return response.status(500).json({
        status: 'Fail',
        error: error.message
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
      return response.status(500).json({
        status: 'Fail',
        error: error.message
      });
    }
  }
}

export default ArticleController;
