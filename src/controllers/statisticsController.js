import models from '../db/models';

const { Statistics } = models;

/**
 * @description class responsible for statistics of author's article readCount
 *
 * @class StatisticsController
 */
class StatisticsController {
  /**
   * @description - This method is responsible for creating and updating article readCount
   *
   * @static
   * @param {object} request - Request sent to the router
   * @param {object} author - Username of the author of the article
   *
   * @returns {object} - Indication of the end of codeblock
   *
   * @memberof StatisticsController
   */
  static async hasReadArticle(request, author) {
    const articleSlug = request.params.slug;

    const lastRead = await Statistics.findOne({
      where: { articleSlug },
      order: [['id', 'DESC']]
    });

    const readCount = 1;
    if (!lastRead) {
      await Statistics.create({
        author,
        articleSlug,
        readCount
      });
    } else {
      const timeUpdated = new Date(lastRead.updatedAt).toString().split(' ');
      const currentTimeStamp = new Date().toString().split(' ');

      if (timeUpdated[1] === currentTimeStamp[1] && timeUpdated[3] === currentTimeStamp[3]) {
        await Statistics.update(
          { readCount: lastRead.readCount + 1 },
          { where: { id: lastRead.id } }
        );
        return;
      }
      await Statistics.create({
        author,
        articleSlug,
        readCount
      });
    }
  }

  /**
   * @description - This method is responsible for retrieving read-stats by year, or by month
   *
   * @static
   * @param {object} request - Request sent to the router
   * @param {object} response - Request sent from the controller
   *
   * @returns {object} - object representing response message
   *
   * @memberof StatisticsController
   */
  static async getReadStatistics(request, response) {
    const { allReadData } = request.body;
    const { year, month } = request.query;

    if (year && !month) {
      const annualRead = allReadData.filter((data) => {
        const date = new Date(data.updatedAt);
        return date.toString().includes(year);
      });
      let annualReadCount = 0;
      annualRead.forEach((count) => {
        annualReadCount += count.readCount;
      });
      return response.status(200)
        .json({
          message: `Statistics for the year ${year}`,
          annualReadCount
        });
    }
    if (year && month) {
      const monthlyRead = allReadData.find((data) => {
        const date = new Date(data.updatedAt);
        return date.toString().includes(year && month);
      });
      const monthlyReadCount = monthlyRead.readCount;

      return response.status(200)
        .json({
          message: `Statistics for ${month} ${year}`,
          monthlyReadCount
        });
    }
  }
}

const { hasReadArticle, getReadStatistics } = StatisticsController;
export { hasReadArticle, getReadStatistics };
