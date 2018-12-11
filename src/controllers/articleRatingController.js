import models from '../db/models';

const { Rating } = models;


/**
 * @description class responsible for rating artcles
 *
 * @class ArticleRatingController
 */
class ArticleRatingController {
  /**
   * @description - This method is responsible for rating user article
   *
   * @static
   * @param {object} request - Request sent to the router
   * @param {object} response - Response sent from the controller
   *
   * @returns {object} - object representing response message
   *
   * @memberof ArticleRatingController
   */
  static async rateArticle(request, response) {
    const { rating } = request.body;
    const articleSlug = request.params.slug;

    try {
      const result = await Rating.create({
        articleSlug,
        rating
      });
      response.status(201)
        .json({
          message: 'Rating recorded successfully',
          result
        });
    } catch (error) {
      response.status(500).json({
        status: 'Fail',
        error: error.message
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
   * @memberof ArticleRatingController
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
}

const { rateArticle, articleAverageRating } = ArticleRatingController;
export { rateArticle, articleAverageRating };
