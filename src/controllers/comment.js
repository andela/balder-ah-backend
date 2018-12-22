import models from '../db/models';
import errorResponse from '../helpers';
import logTracker from '../../logger/logTraker';

const { Comment: CommentModel, User } = models;
const errorMessage = 'Could not complete action at this time';

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
      logTracker(error);
      response.status(500).send(errorResponse([errorMessage]));
    }
  }

  /**
   * @description - Gets an article comment by it's ID
   *
   * @static
   * @param {object} request - Request sent to the router
   * @param {object} response - Response sent from the controller
   * @param {object} next - Callback sent to the next middleware
   *
   * @returns {object} - a single comment
   *
   * @memberof Comment
   */
  static async getOneValidator(request, response, next) {
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
      request.body.comments = comments;
      return next();
    } catch (error) {
      logTracker(error);
      response.status(500).send(errorResponse([errorMessage]));
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
    const { comments } = request.body;
    const comment = comments[0];
    response.send({ comment });
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
      logTracker(error);
      return response.status(500).send(errorResponse([errorMessage]));
    }
  }
}

export default Comment;
