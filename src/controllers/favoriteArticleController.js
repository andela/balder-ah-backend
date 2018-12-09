import errorResponse from '../helpers/index';
import ArticleModel from '../helpers/articles';
import FavoriteModelHelper from '../helpers/favorite';

/**
 * @class FavoriteArticleController
 */
class FavoriteArticleController {
  /**
   *
   * @param {*} request - request object
   * @param {*} response - response object
   * @returns {void} - redirects to article page
   */
  static async favoriteArticle(request, response) {
    const { slug } = request.params;
    const userId = request.userData.payload.id;
    try {
      const articleId = (await ArticleModel.queryForArticle(slug)).id;
      await FavoriteModelHelper.favoriteArticle(articleId, userId);

      response.redirect(`/api/articles/${slug}`);
    } catch (error) {
      response.status(500).json(errorResponse([error.message]));
    }
  }

  /**
   *
   * @param {*} request - request object
   * @param {*} response - response object
   * @returns {void} - redirects to article page
   */
  static async unfavoriteArticle(request, response) {
    const { slug } = request.params;
    const userId = request.userData.payload.id;
    try {
      const articleId = (await ArticleModel.queryForArticle(slug)).id;
      await FavoriteModelHelper.unfavoriteArticle(articleId, userId);
      response.redirect(`/api/articles/${slug}`);
    } catch (error) {
      response.status(500).json(errorResponse([error.message]));
    }
  }
}

export default FavoriteArticleController;
