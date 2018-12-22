import models from '../db/models';
import errorResponse from '../helpers';
import logTracker from '../../logger/logTraker';

const { Report } = models;
const errorMessage = 'Could not complete action at this time';

/**
 * @description A controller class for handling comment business logic
 *
 * @class Comment
 */
class ReportArticle {
  /**
   * @description - reports an article
   *
   * @static
   * @param {object} request - request object
   * @param {object} response - response object
   *
   * @returns {object} - error or success response
   *
   * @memberof Comment
   */
  static async report(request, response) {
    let { type: reportType = '', context } = request.body;
    reportType = reportType ? reportType.toLowerCase() : '';
    context = context || '';

    const reportTypes = ['spam', 'harrassment', 'rules violation', 'terrorism', 'other'];

    if (!reportType || !reportTypes.includes(reportType)) {
      return response
        .status(400)
        .send(errorResponse([`Please enter a report type. Could be one of [${reportTypes.join(', ')}]`]));
    }

    if (reportType === reportTypes[reportTypes.length - 1] && !context) {
      return response
        .status(400)
        .send(errorResponse(['Please help us understand why you\'re reporting this article by providing context.']));
    }

    const { userData: user, article } = request;
    const { id: userId } = user.payload;
    const { id: articleId } = article;

    try {
      await Report.create({
        report_type: reportType,
        userId,
        articleId,
        context
      });

      return response.send({ success: { msg: 'Report received' } });
    } catch (error) {
      logTracker(error);
      return response.status(500).send(errorResponse([errorMessage]));
    }
  }
}

export default ReportArticle;
