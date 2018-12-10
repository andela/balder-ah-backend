import models from '../db/models';
import errorResponse from '../helpers';

const { Comment: CommentModel, User } = models;

/**
 * @description A controller class for handling comment business logic
 *
 * @class Comment
 */
class Comment {
  /**
   * @description - Gets all comments associated with an article
   *
   * @static
   * @param {object} request - Request sent to the router
   * @param {object} response - Response sent from the controller
   *
   * @returns {object} - containing an array of comments
   *
   * @memberof Comment
   */
  static async getAll(request, response) {
    const { article } = request;
    try {
      const comments = await article.getComments({
        attributes: ['id', 'createdAt', 'userId', 'updatedAt', 'body'],
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['username', 'bio', 'image']
          }
        ]
      });

      const commentsCount = comments.length;
      response.send({ comments, commentsCount });
    } catch (error) {
      response.status(500).send(errorResponse([error.message]));
    }
  }

  /**
   * @description - Gets an article comment by it's ID
   *
   * @static
   * @param {object} request - Request sent to the router
   * @param {object} response - Response sent from the controller
   *
   * @returns {object} - a single comment
   *
   * @memberof Comment
   */
  static async getOne(request, response) {
    const { article, params } = request;
    const { commentId } = params;

    try {
      const comments = await article.getComments({
        attributes: ['id', 'createdAt', 'userId', 'updatedAt', 'body'],
        where: { id: parseInt(commentId, 10) },
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['username', 'bio', 'image']
          }
        ]
      });

      if (!comments.length) return response.status(404).send(errorResponse([`Comment with id ${commentId} not found`]));

      const comment = comments[0];
      response.send({ comment });
    } catch (error) {
      response.status(500).send(errorResponse(['Server error. Failed to get comment']));
    }
  }

  /**
   * @description - Create/Post a comment on an article
   *
   * @static
   * @param {object} request - Request sent to the router
   * @param {object} response - Response sent from the controller
   *
   * @returns {object} - object representing response message
   *
   * @memberof Comment
   */
  static async create(request, response) {
    const { body: commentBody = '' } = request.body;

    if (!commentBody || !commentBody.trim()) return response.status(400).send(errorResponse(['Comment body is required']));

    const { userData: user, article } = request;
    const articleId = article.get('id');

    const { id: userId } = user.payload;

    try {
      const postComment = await CommentModel.create({
        body: commentBody,
        userId,
        articleId
      });

      if (!postComment) {
        return response.status(500).send(errorResponse(['Unable to post comment']));
      }

      return response.status(201).send({
        comment: {
          body: commentBody
        }
      });
    } catch (error) {
      return response.status(500).send(errorResponse(['Server error: Failed to post comment']));
    }
  }
}

export default Comment;
