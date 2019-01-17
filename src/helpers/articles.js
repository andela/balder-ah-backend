import Models from '../db/models';
import TagHelpers from './tagHelpers';
import logTracker from '../../logger/logTracker';

const { Article, ArticleTags } = Models;
const errorMessage = 'Could not complete action at this time';

/**
 * @description class representing Article Helpers
 * @class ArticleModel
 */
class ArticleModel {
  /**
   * @description - This method is responsible for creating a new article
   * @static
   * @param {object} all arguments containing objects needed to create a new article
   * @returns {object} - object representing newly created article
   * @memberof ArticleModel
   */
  static async createArticle(...args) {
    const newArticle = await Article.create(...args);
    return newArticle;
  }

  /**
   * @description - This method is responsible for querying all articles from the database
   * @static
   * @param {object} page - Page number for calculating offset used for querying the database
   * @returns {object} - object representing response message
   * @memberof ArticleModel
   */
  static async getAllArticle(page) {
    const allArticles = await Article.findAndCountAll();
    const articleCount = allArticles.count;
    const numberOfArticlesPerPage = 10;

    const currentPage = page || 1;
    const startFrom = numberOfArticlesPerPage * (currentPage - 1);
    if (articleCount < 1) {
      return [];
    }
    const allArticle = await Article.findAll({
      offset: startFrom,
      limit: numberOfArticlesPerPage,
      order: [['createdAt', 'DESC']],
      include: [
        {
          association: 'author',
          attributes: ['username', 'bio', 'image']
        },
        {
          association: 'tags',
          attributes: ['name'],
          through: {
            attributes: []
          }
        },
        {
          association: 'favoritesCount',
          attributes: ['userId']
        }
      ]
    });
    return allArticle;
  }

  /**
   * @description - This method is responsible for querying the database for an article
   * @param {string} slug
   * @returns {object} article which found
   * @memberof ArticleModel
   */
  static async getOneArticle(slug) {
    const oneArticle = await Article.findOne({
      where: {
        slug
      },
      include: [
        {
          association: 'author',
          attributes: ['username', 'bio', 'image']
        },
        {
          association: 'tags',
          attributes: ['name'],
          through: {
            attributes: []
          }
        },
        {
          association: 'favoritesCount'
        }
      ]
    });
    return oneArticle;
  }

  /**
   * @description - This method is responsible for querying the database for an article
   * @static
   * @param {string} slug
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
   * @description - This method is responsible for the update query of the database
   * @static
   * @param {object} request - Request sent to the router
   * @param {object} response - Response sent from the controller
   * @param {object} data - Request sent to the middleware
   * @param {object} slug - Request sent to the middleware
   * @returns {object} - object representing response message
   * @memberof ArticleModel
   */
  static async update(request, response, data, slug) {
    const {
      title, description, body, tags, imgUrl,
    } = request.body;
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
      if (imgUrl) {
        updatedData.imgUrl = imgUrl;
      }
      const tagResponse = await TagHelpers.addNewTag(tags);
      const updatedArticle = await Article.update(updatedData, {
        returning: true,
        where: {
          slug
        }
      });

      const searchedSlug = slug;
      const foundArticle = await Article.findOne({ where: { slug: searchedSlug } });
      foundArticle.setTags(tagResponse);
      return response.status(200).json({
        status: 'Success',
        message: 'Article has been updated successfully',
        updatedArticle: updatedArticle[1][0]
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
   * @description - This method is responsible for querying the database to delete existing articles
   * @static
   * @param {string} slug
   * @returns {object} - object representing response message
   * @memberof ArticleModel
   */
  static async delete(slug) {
    const fondArticle = await Article.findOne({
      where: {
        slug
      }
    });
    const deletedItem = await Article.destroy({
      where: {
        slug
      }
    });
    if (deletedItem) {
      ArticleTags.destroy({ where: { articleId: fondArticle.id } });
    }
    return deletedItem;
  }

  /**
   * @description - This method is responsible for querying the database to check if a slug exists
   * @static
   * @param {string} slug
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
