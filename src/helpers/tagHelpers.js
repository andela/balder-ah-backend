import Models from '../db/models';

const { Tag } = Models;

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
      return error.message;
    }
  }
}
export default TagHelpers;
