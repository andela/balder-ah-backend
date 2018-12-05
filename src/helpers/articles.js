import Models from '../db/models';

const { Article } = Models;

/**
 * @description class representing Article Helpers
 * @class ArticleModel
 */
class ArticleModel {
  static async createArticle(...args) {
    const newArticle = await Article.create(...args);
    return newArticle;
  }

  /**
   * @description - This method is responsible for querying all articles from the database
   * @static
   * @param {object} request - Request sent to the router
   * @param {object} response - Response sent from the controller
   * @returns {object} - object representing response message
   * @memberof ArticleModel
   */
  static async getAllArticle() {
    const allArticle = await Article.findAll({
      attributes: {
        exclude: ['userId']
      },
      include: [
        {
          association: 'author',
          attributes: ['username']
        }
      ]
    });
    return allArticle;
  }

  static async getOneArticle(slug) {
    const oneArticle = await Article.findOne({
      where: {
        slug
      },
      attributes: {
        exclude: ['userId']
      },
      include: [
        {
          association: 'author',
          attributes: ['username']
        }
      ]
    });
    return oneArticle;
  }

  /**
   * @description - This method is responsible for quering the database for an article
   * @static
   * @param {object} request - Request sent to the router
   * @param {object} response - Response sent from the controller
   * @returns {object} - object representing response message
   * @memberof ArticleModel
   */
  static async queryForArticle(slug) {
    const findArticle = await Article.findOne({
      where: {
        slug
      }
    });
    if (findArticle) {
      return findArticle;
    }
    return {};
  }

  /**
   * @description - This method is responsible for the update query of the datbase
   * @static
   * @param {object} request - Request sent to the router
   * @param {object} response - Response sent from the controller
   * @returns {object} - object representing response message
   * @memberof ArticleModel
   */
  static async update(request, response, data, slug) {
    const { title, description, body } = request.body;
    try {
      const updatedData = {};
      if (title) {
        updatedData.title = title;
      }
      if (description) {
        updatedData.description = description;
      }
      if (body) {
        updatedData.body = body;
      }
      await Article.update(updatedData, {
        returning: true,
        where: {
          slug
        }
      });
      return response.status(200).json({
        status: 'Success',
        message: 'Article has been updated successfully',
        updatedData
      });
    } catch (error) {
      return response.status(500).json({
        status: 'Fail',
        error: error.message
      });
    }
  }

  /**
   * @description - This method is responsible for querying the database to delete exising articles
   * @static
   * @param {object} request - Request sent to the router
   * @param {object} response - Response sent from the controller
   * @returns {object} - object representing response message
   * @memberof ArticleModel
   */
  static async delete(slug) {
    const deletedItem = await Article.destroy({
      where: {
        slug
      }
    });
    return deletedItem;
  }

  /**
   * @description - This method is responsible for querting the database to check if a slug exists
   * @static
   * @param {object} request - Request sent to the router
   * @param {object} response - Response sent from the controller
   * @returns {object} - object representing response message
   * @memberof ArticleModel
   */
  static async checkSlug(slug) {
    const foundSlug = await Article.findOne({
      where: { slug }
    });

    if (!foundSlug) {
      return {};
    }
    return foundSlug;
  }
}

export default ArticleModel;
