import sequelize from 'sequelize';
import models from '../db/models';
import TagHelpers from '../helpers/tagHelpers';

const { Tag, ArticleTags } = models;

/**
 * @description class representing article tags
 *
 * @class TagsController
 */
class TagsController {
  /**
   * @description - This method is responsible for retrieving all tags on the platform
   *
   * @static
   * @param {object} request - Request sent to the router
   * @param {object} response - Response sent from the controller
   *
   * @returns {object} - object representing response message and all tags object
   *
   * @memberof TagsController
   */
  static async getAllTags(request, response) {
    try {
      let allTags = await Tag.findAll({
        order: [['id', 'DESC']],
        attributes: [
          'name',
        ],
      });
      if (allTags.length < 1) {
        return response.status(404).json({
          status: 'Fail',
          message: 'No tags found',
        });
      }
      allTags = allTags.map((tags) => {
        tags = tags.toJSON();
        tags = tags.name;
        return tags;
      });
      return response.status(200).json({
        status: 'Success',
        message: 'Retrieved all tags successfully',
        allTags,
      });
    } catch (error) {
      response.status(500).json({
        status: 'Fail',
        error: error.message
      });
    }
  }

  /**
   * @description - This method is responsible for retrieving all trending/popular
   * tags on the platform
   *
   * @static
   * @param {object} request - Request sent to the router
   * @param {object} response - Response sent from the controller
   *
   * @returns {object} - object representing response message and trending tags object
   *
   * @memberof TagsController
   */
  static async getTrendingTags(request, response) {
    try {
      let topTags = await ArticleTags.findAll({
        attributes: ['tagId', [sequelize.fn('count', sequelize.col('ArticleTags.tagId')), 'tagcount']],
        group: ['ArticleTags.tagId'],
        order: [['count', 'DESC']],
        limit: 20
      });

      if (topTags.length < 1) {
        return response.status(404).json({
          status: 'Fail',
          message: 'No trending tag found',
        });
      }

      topTags = topTags.map((top) => {
        top = top.tagId;
        return top;
      });
      const trendingTags = await TagHelpers.findTags(topTags);
      return response.status(200).json({
        status: 'Success',
        message: 'Retrieved all trending tags successfully',
        trendingTags,
      });
    } catch (error) {
      response.status(500).json({
        status: 'Fail',
        error: error.message
      });
    }
  }
}

const { getAllTags, getTrendingTags } = TagsController;

export { getAllTags, getTrendingTags };
