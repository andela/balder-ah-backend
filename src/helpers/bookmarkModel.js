import Models from '../db/models';
import ArticleModel from './articles';
import errorResponse from '.';

const { Article, Bookmark, User } = Models;

/**
 * @description class representing Bookmark Helpers
 * @class BookmarkModel
 */
class BookmarkModel {
  /**
   * @description - This method is responsible for bookmarking an article
   * @static
   * @param {object} response - Response sent from the controller
   * @param {object} slug - Request sent to the middleware
   * @param {object} userId - Request sent to the middleware
   * @returns {void}
   * @memberof BookmarkModel
   */
  static async addBookmark(response, slug, userId) {
    try {
      const foundArticle = await ArticleModel.queryForArticle(slug);
      const articleId = foundArticle.id;
      await Bookmark.findOrCreate({
        where: {
          userId,
          articleId
        }
      }).spread((check, created) => {
        if (!created) {
          return response.status(400).json(errorResponse(['Article already bookmarked']));
        }
        return response.status(200).json({
          status: 'Success',
          message: 'Article successfully bookmarked'
        });
      });
    } catch (error) {
      return response.status(500).json(errorResponse([error.message]));
    }
  }

  /**
   * @description - This method is responsible for fetching a user's bookmarks
   * @static
   * @param {object} userId - Request sent to the middleware
   * @returns {object} - object representing list of bookmarked articles
   * @memberof BookmarkModel
   */
  static async getBookmarks(userId) {
    const bookmarks = await Bookmark.findAll({
      where: {
        userId
      },
      attributes: {
        exclude: [
          'userId',
          'articleId',
          'createdAt',
          'updatedAt'
        ]
      },
      include: [
        {
          model: Article,
          attributes: [
            'title',
            'description',
            'imgUrl',
            'createdAt',
          ],
          include: [
            {
              model: User,
              as: 'author',
              attributes: ['username']
            },
            {
              association: 'tags',
              attributes: ['name'],
              through: {
                attributes: []
              }
            }
          ]
        }
      ]
    });
    return bookmarks;
  }

  /**
   * @description - This method is responsible for fetching a bookmark by Id
   * @static
   * @param {object} id - Response sent from the controller
   * @returns {object} - object representing a bookmarked article
   * @memberof BookmarkModel
   */
  static async getBookmarkById(id) {
    const foundBookmark = await Bookmark.findOne({
      where: {
        id
      }
    });
    return foundBookmark;
  }

  /**
   * @static
   * @param {number} articleId - article id to check
   * @param {number} userId - user id who's checking
   * @returns {Boolean} - true if user has bookmarked the article
   */
  static async hasBeenBookmarked(articleId, userId) {
    const bookmarkExists = await Bookmark.findOne({
      where: { articleId, userId }
    });
    return !!bookmarkExists;
  }

  /**
   * @description - This method is responsible for removing a user's bookmarks
   * @static
   * @param {object} response - Response sent from the controller
   * @param {object} userId - Request sent to the middleware
   * @param {object} id - Request sent to the middleware
   * @returns {void}
   * @memberof BookmarkModel
   */
  static async removeBookmarks(response, userId, id) {
    try {
      const foundArticle = await this.getBookmarkById(id);
      const { articleId } = foundArticle.dataValues;
      const removedBookmark = await Bookmark.destroy({
        where: {
          userId,
          articleId
        }
      });
      if (removedBookmark) {
        return response.status(202).json({
          status: 'Success',
          message: 'Bookmark removed successfully'
        });
      }
    } catch (error) {
      return response.status(500).json(errorResponse([error.message]));
    }
  }
}

export default BookmarkModel;
