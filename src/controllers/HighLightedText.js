import models from '../db/models';
import ArticleModel from '../helpers/articles';
import errorResponse from '../helpers';

const { HighlightedText: HighLightedTextModel } = models;
/**
 * @description class representing comment on Highlightedtext Controller
 * @class HighLightedText
 */
class HighLightedText {
  /**
   * @description - This method is responsible for creating new comment on a highlighted text.
   * @static
   * @param {object} request - Request sent to the router
   * @param {object} response - Response sent from the controller
   * @returns {object} - object representing response message
   * @memberof HighLightedText
   */
  static async createComment(request, response) {
    const { slug } = request.params;
    const userId = request.userData.payload.id;
    const { text, comment } = request.body;
    try {
      const article = await ArticleModel.getOneArticle(slug);
      const checkHighLightedText = article.body.includes(text);
      if (!checkHighLightedText) {
        return response.status(404).json({
          status: 'Fail',
          message: 'Article does not contain the highlighted text',
        });
      }
      const payLoad = {
        text,
        comment,
        articleId: article.id,
        userId
      };
      const createdComment = await HighLightedTextModel.create(payLoad);
      return response.status(201).json({
        status: 'Success',
        message: 'Comment created successfully',
        comment: createdComment
      });
    } catch (error) {
      response.status(500).json({
        status: 'Fail',
        message: errorResponse(['Server error. Please try again']),
      });
    }
  }
}
export default HighLightedText;
