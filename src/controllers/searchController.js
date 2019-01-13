import Models from '../db/models';
import errorResponse from '../helpers/index';
import logTracker from '../../logger/logTracker';

const { User, Article, Tag } = Models;
const errorMessage = 'Could not complete action at this time';

/**
 * @description class representing Article Controller
 * @class SearchController
 */
class SearchController {
  /**
   * @description - This method is responsible for searching articles by author
   * @static
   * @param {object} request - Request sent to the router
   * @param {object} response - Response sent from the controller
   * @returns {object} - object representing response messages
   * @memberof SearchController
   */
  static async searchByAuthor(request, response) {
    const authorName = request.params.author;
    try {
      const author = await User.findOne({
        where: {
          username: authorName
        },
        include: [
          {
            model: Article,
            as: 'articles',
            attributes: ['slug', 'title', 'description', 'body', 'imgUrl']
          }
        ],
        attributes: ['id', 'username', 'bio', 'email', 'image']
      });
      if (author) {
        if (author.dataValues.articles.length < 1) {
          return response.status(404).json(errorResponse(['No article found']));
        }
        return response.status(200).json({
          status: 'Success',
          message: 'Articles found successfully',
          author
        });
      }
      return response.status(404).json(errorResponse(['Author not found']));
    } catch (error) {
      logTracker(error);
      return response.status(500).json(errorResponse([errorMessage]));
    }
  }

  /**
   * @description - This method is responsible for searching articles by keyword
   * @static
   * @param {object} request - Request sent to the router
   * @param {object} response - Response sent from the controller
   * @returns {object} - object representing response message
   * @memberof SearchController
   */
  static async searchByKeyword(request, response) {
    const { keyword } = request.params;
    try {
      const articles = await Article.findAll({
        where: {
          $or: [
            {
              title: { $iLike: `%${keyword}%` }
            },
            {
              description: { $iLike: `%${keyword}%` }
            }
          ]
        },
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'username', 'email', 'image']
          }
        ],
        attributes: ['slug', 'title', 'description', 'body', 'imgUrl', 'readtime']
      });
      if (articles.length === 0) {
        return response.status(404).json(errorResponse(['No article found']));
      }
      return response.status(200).json({
        status: 'Success',
        message: 'Articles found successfully',
        articles
      });
    } catch (error) {
      logTracker(error);
      return response.status(500).json(errorResponse([errorMessage]));
    }
  }

  /**
   * @description - This method is responsible for searching for articles by tags
   * @param {object} request - Request object
   * @param {object} response - Response object
   * @returns {object} - object representing response messages
   * @memberof SearchController
   */
  static async searchByTags(request, response) {
    const tagName = request.params.tagname;
    const tagModified = tagName.toLowerCase();
    try {
      const articles = await Tag.findOne({
        where: {
          name: tagModified
        },
        include: [
          {
            model: Article,
            as: 'articles',
            attributes: ['slug', 'title', 'description', 'body', 'imgUrl', 'readtime']
          }
        ]
      });
      if (!articles) {
        return response.status(404).json(errorResponse(['No article with such tag found']));
      }
      return response.status(200).json({
        status: 'Success',
        message: 'Articles found successfully',
        articles
      });
    } catch (error) {
      logTracker(error);
      return response.status(500).json(errorResponse([errorMessage]));
    }
  }
}

export default SearchController;
