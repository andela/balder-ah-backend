import Models from '../db/models';
import errorResponse from '../helpers/index';

const { Bookmark } = Models;


const paramsChecker = {
  idChecker: (request, response, next) => {
    const { id } = request.params;
    const validId = /^[0-9]+$/;
    if (id) {
      if (!id.match(validId)) {
        return response.status(400).json(errorResponse(['Id can only be numbers']));
      }
    }
    return next();
  },
  validateId: async (request, response, next) => {
    const { id } = request.params;
    const validBookmark = await Bookmark.findOne({
      where: {
        id
      }
    });
    if (!validBookmark) {
      return response.status(404).json({ message: 'No bookmark found' });
    }
    return next();
  }
};

export default paramsChecker;
