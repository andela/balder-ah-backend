import models from '../db/models';
import ArticleModel from '../helpers/articles';
import logTracker from '../../logger/logTraker';

const { Rating } = models;
const errorMessage = 'Could not complete action at this time';


/**
 * @description class responsible for rating artcles
 *
 * @class ArticleRatingController
 */
class RatingController {
  /**
   * @description - This method is responsible for rating user article
   *
   * @static
   * @param {object} request - Request sent to the router
   * @param {object} response - Response sent from the controller
   *
   * @returns {object} - object representing response message
   *
   * @memberof RatingController
   */
  static async rateArticle(request, response) {
    const { rating } = request.body;
    const articleSlug = request.params.slug;

    try {
      const getOneArticle = (await ArticleModel.getOneArticle(articleSlug)).toJSON();

      const authorId = getOneArticle.userId;
      const { username: author } = getOneArticle.author;

      const result = await Rating.create({
        authorId,
        author,
        articleSlug,
        rating
      });
      response.status(201)
        .json({
          message: 'Rating recorded successfully',
          result
        });
    } catch (error) {
      logTracker(error);
      response.status(500).json({
        status: 'Fail',
        message: errorMessage
      });
    }
  }

  /**
   * @description - This method is responsible for calculating average rating of an article
   *
   * @static
   * @param {object} request - Request sent to the router
   * @param {object} response - Response sent from the controller
   *
   * @returns {object} - object representing response message
   *
   * @memberof RatingController
   */
  static async articleAverageRating(request) {
    const articleSlug = request.params.slug;
    const articleRatings = await Rating.findAll({
      where: { articleSlug }
    });
    let articleRatingStar = 0;

    if (!articleRatings.length) return articleRatingStar;

    let sum = 0;
    articleRatings.forEach((dataValues) => {
      sum += Number(dataValues.rating);
    });
    articleRatingStar = sum / articleRatings.length;
    return articleRatingStar.toFixed(1);
  }

  /**
   * @description - This method is responsible for calculating average rating of an article
   *
   * @static
   * @param {object} request - Request sent to the router
   * @param {object} response - Response sent from the controller
   *
   * @returns {object} - object representing response message
   *
   * @memberof RatingController
   */
  static async authorRating(request) {
    let allArticleRatings;
    const author = request.params.username;
    if (author) {
      allArticleRatings = await Rating.findAll({
        where: { author }
      });
    }
    if (request.userData) {
      const authorId = request.userData.payload.id;
      allArticleRatings = await Rating.findAll({
        where: { authorId }
      });
    }
    let authorRatingStar = 0;

    if (!allArticleRatings.length) return authorRatingStar;

    let sum = 0;
    allArticleRatings.forEach((dataValues) => {
      sum += Number(dataValues.rating);
    });
    authorRatingStar = sum / allArticleRatings.length;
    return authorRatingStar.toFixed(1);
  }
}

const { rateArticle, articleAverageRating, authorRating } = RatingController;
export { rateArticle, articleAverageRating, authorRating };
