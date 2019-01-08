import Models from '../db/models';
import logTracker from '../../logger/logTracker';

const { Tag } = Models;
const errorMessage = 'Could not complete action at this time';

/**
 * @description class representing Tag Helpers
 * @class TagHelpers
 */
class TagHelpers {
  /**
   * @description - This method is responsible for adding all the new tags
   * @static
   * @param {object} newArticleTags - Array of tags(new or old) to be added
   * @returns {object} - an array of tag IDs
   * @memberof TagHelpers
   */
  static async addNewTag(newArticleTags) {
    try {
      const tagsNeeded = [];
      const allTags = await Promise.all(newArticleTags.map(tag => Tag.findOrCreate({
        name: 'tag',
        where: { name: tag.trim().toLowerCase() }
      })));
      allTags.forEach((Tags) => {
        tagsNeeded.push(Tags[0].id);
      });
      return tagsNeeded;
    } catch (error) {
      logTracker(error);
      return errorMessage;
    }
  }

  /**
   * @description - This method is responsible for retrieving all the top tag names
   * @static
   * @param {object} topTags - Array of the top tag IDs
   * @returns {object} - an array of tags objects with name property
   * @memberof TagHelpers
   */
  static async findTags(topTags) {
    try {
      const allTags = await Tag.findAll();
      const tagNames = allTags.filter(tag => topTags.includes(tag.id));
      const sortedTagNames = topTags
        .map(topTag => tagNames.find(tag => tag.id === topTag))
        .map(topTag => topTag.name);
      return sortedTagNames;
    } catch (error) {
      logTracker(error);
      return errorMessage;
    }
  }
}
export default TagHelpers;
