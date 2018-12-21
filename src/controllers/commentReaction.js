import LikeComment from '../db/models';
import errorResponse from '../helpers/index';

const { CommentReaction } = LikeComment;

/**
 * @description this class handles methods for liking and unliking comment
 */
class ReactionController {
  /**
   * @description - This method is responsible for liking or unliking a comment
   * @static
   * @param {object} request - Request sent to the router
   * @param {object} response - Response sent from the controller
   * @returns {object} - object representing response message
   * @memberof CommentReaction
   */
  static async likeOrUnlikeOneComment(request, response) {
    try {
      const { commentId } = request.params;
      const userId = request.userData.payload.id;
      const where = { $and: [{ commentId }, { likedBy: userId }] };

      const commentReaction = await CommentReaction.findOne({ where });
      if (commentReaction) {
        await CommentReaction.destroy({ where });
        return response.status(200).json({
          message: 'Comment unliked successfully'
        });
      }
      await CommentReaction.create({
        isLiked: true,
        likedBy: userId,
        commentId
      });
      return response.status(201).json({
        status: 'Success',
        message: 'Comment liked successfully'
      });
    } catch (error) {
      return response.status(500).json(errorResponse([error.message]));
    }
  }
}

export default ReactionController;
