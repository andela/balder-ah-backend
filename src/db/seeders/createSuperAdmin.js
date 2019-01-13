import dotenv from 'dotenv';
import models from '../models';

dotenv.config();

const { User } = models;

const {
  SUPER_ADMIN_STATUS,
  SUPER_ADMIN_EMAIL,
  SUPER_ADMIN_PASSWORD,
  SUPER_ADMIN_USERNAME
} = process.env;
/**
 * @description class representing create superUser
 *
 * @class CreateSuperAdmin
 */
class CreateSuperAdmin {
  /**
   * @description - This method is responsible for creating super user
   * @static
   * @returns {object} - object representing response message
   * @memberof CreateSuperAdmin
   */
  static async registerSuperAdmin() {
    try {
      await User.findOrCreate({

        where: { $or: [{ username: SUPER_ADMIN_USERNAME }, { email: SUPER_ADMIN_EMAIL }] },
        defaults:
        {
          username: SUPER_ADMIN_USERNAME,
          email: SUPER_ADMIN_EMAIL,
          password: SUPER_ADMIN_PASSWORD,
          role: SUPER_ADMIN_STATUS
        }
      });
    } catch (error) {
      throw new Error('Something went wrong');
    }
  }
}

const { registerSuperAdmin } = CreateSuperAdmin;

export default registerSuperAdmin;
