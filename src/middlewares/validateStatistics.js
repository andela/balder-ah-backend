import models from '../db/models';

const { Statistics } = models;

/**
 * @description class responsible for validating artcle stats input queries
 *
 * @class ValidateStatistics
 */
class ValidateStatistics {
  /**
    * @description - This method is responsible for validating statistics query from users
    * @static
    * @param {object} request - Request sent to the middleware
    * @param {object} response - Response sent from the middleware
    * @param {object} next - callback function that transfers to the next method
    * @returns {object} - object representing response message
    * @memberof ValidateStatistics
    */
  static async articleStatsValidatior(request, response, next) {
    const articleSlug = request.params.slug;
    const author = request.userData.payload.username;

    let { year, month } = request.query;
    try {
      const allReadData = await Statistics.findAll({
        where: {
          $and: [{ articleSlug }, { author }]
        }
      });
      if (!allReadData.length) {
        return response.status(404)
          .json({
            message: 'Sorry, you have no statistics to view at this time',
          });
      }
      if (!year && !month) {
        let lifeTimeReadCount = 0;
        allReadData.forEach((count) => {
          lifeTimeReadCount += count.readCount;
        });
        return response.status(200)
          .json({
            message: 'Total reading statistics',
            lifeTimeReadCount
          });
      }

      if (year) {
        const errors = [];
        year = year.trim();
        if (!/^([0-9]){4}$/.test(year)) {
          const error = {
            message: 'Valid year should be a 4 digit integer'
          };
          errors.push(error);
        }
        if (month) {
          month = month.toLowerCase().trim();
          month = month.charAt(0).toUpperCase() + month.substr(1);
          const validMonth = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

          if (!validMonth.includes(month)) {
            const error = {
              message: 'Valid month should be the first three alphabets of the month'
            };
            errors.push(error);
          }
        }
        if (errors.length > 0) {
          return response.status(400).json({
            errors: { body: errors.map(error => error.message) }
          });
        }

        request.query.year = year;
        request.query.month = month;
        request.body.allReadData = allReadData;
        return next();
      }
      return response.status(400)
        .json({
          message: 'Please specify the year you want to query',
        });
    } catch (error) {
      response.status(500)
        .json({
          message: error.message
        });
    }
  }
}

const { articleStatsValidatior } = ValidateStatistics;
export default articleStatsValidatior;
