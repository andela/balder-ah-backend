import BookmarkModel from '../helpers/bookmarkModel';
import errorResponse from '../helpers/index';
/**
 * @description class representing Bookmark Controller
 * @class BookmarkController
 */
class BookmarkController {
  /**
   * @description - This method is responsible for bookmarking an article
   * @static
   * @param {object} request - Request sent to the router
   * @param {object} response - Response sent from the controller
   * @returns {void}
   * @memberof BookmarkController
   */
  static async bookmark(request, response) {
    const { slug } = request.params;
    const { id: userId } = request.userData.payload;
    await BookmarkModel.addBookmark(response, slug, userId);
  }

  /**
   * @description - This method is responsible for getting a user's bookmarks
   * @static
   * @param {object} request - Request sent to the router
   * @param {object} response - Response sent from the controller
   * @returns {object} - object representing response message
   * @memberof BookmarkController
   */
  static async getAllBookmark(request, response) {
    try {
      const userId = request.userData.payload.id;
      const bookmarks = await BookmarkModel.getBookmarks(userId);
      if (!bookmarks.length) {
        return response.status(404).json({ message: 'No bookmark available' });
      }
      return response.status(200).json({
        status: 'Success',
        message: 'All bookmarks retrieved',
        bookmarks
      });
    } catch (error) {
      return response.status(500).json(errorResponse([error.message]));
    }
  }

  /**
   * @description - This method is responsible for removing a user's bookmarks
   * @static
   * @param {object} request - Request sent to the router
   * @param {object} response - Response sent from the controller
   * @returns {void}
   * @memberof BookmarkController
   */
  static async unBookmark(request, response) {
    const userId = request.userData.payload.id;
    const { id } = request.params;
    await BookmarkModel.removeBookmarks(response, userId, id);
  }
}

export default BookmarkController;
