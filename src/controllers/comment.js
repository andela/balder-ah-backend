import models from '../db/models';
import errorResponse from '../helpers';
import logTracker from '../../logger/logTraker';
import NotificationsController from './notificationsController';

const { Comment: CommentModel, User } = models;

/**
 * @description Controller class for handling comment business logic
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
        attributes: ['id', 'createdAt', 'userId', 'updatedAt', 'body', 'edited'],
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['username', 'bio', 'image']
          }
        ]
      });

      const commentsCount = comments.length;
      return response.json({ comments, commentsCount });
    } catch (error) {
      logTracker(error);
      return response.status(500).json(errorResponse(['Server error. Falied to get article comments']));
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
        attributes: ['id', 'createdAt', 'userId', 'updatedAt', 'body', 'edited', 'history'],
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
      return response.status(500).json(errorResponse(['Server error. Failed to get comment']));
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

    if (!commentBody || !commentBody.trim()) return response.status(400).json(errorResponse(['Comment body is required']));

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
        return response.status(500).json(errorResponse(['Unable to post comment']));
      }

      NotificationsController.newComment(articleId);
      return response.status(201).json({ comment: { body: commentBody } });
    } catch (error) {
      logTracker(error);
      return response.status(500).json(errorResponse(['Server error: Failed to post comment']));
    }
  }

  /**
   * @description - Update/Edit a comment by ID
   *
   * @static
   * @param {object} request - Request sent to the router
   * @param {object} response - Response sent from the controller
   *
   * @returns {object} - object representing response message
   *
   * @memberof Comment
   */
  static async update(request, response) {
    const { commentId = '' } = request.params;

    if (!commentId) return response.status(400).json(errorResponse(['Please provide ID of comment to update']));
    if (!parseInt(commentId, 10)) return response.status(400).json(errorResponse(['Please enter a valid comment ID']));

    try {
      const { id: userId } = request.userData.payload;

      const existingComment = await CommentModel.findByPk(commentId);

      if (!existingComment) return response.status(404).json(errorResponse(['Comment not found']));
      if (userId !== existingComment.userId) return response.status(403).json(errorResponse(['Not allowed']));

      const { body: newComment } = request.body;

      if (!newComment || !newComment.trim()) return response.status(400).json(errorResponse(['Comment body is required']));
      if (newComment === existingComment.body) return response.status(200).json({ message: 'Comment was not edited because content is the same' });

      const newEditHistory = {
        body: existingComment.body,
        time: existingComment.updatedAt,
      };

      existingComment.history = !existingComment.history[0]
        ? existingComment.history = [newEditHistory]
        : existingComment.history.concat([newEditHistory]);

      existingComment.body = newComment;
      existingComment.edited = true;

      await existingComment.save();

      return response.status(200).json({ message: 'Comment edited successfully' });
    } catch (error) {
      logTracker(error);
      return response.status(500).json(errorResponse(['Failed to find comment']));
    }
  }
}

export default Comment;
