const config = require('config');
const mongoose = require('mongoose');
const http = require('../lib/http');

const baseUrl = 'http://localhost:3000';
const routerPrefix = config.get('routerPrefix');

class Helper {
  /**
   *
   *
   * @static
   * @param {{name: string, dob: string, address: string, description: string}} options - options
   * @returns {{data: object, status: number, headers: object}} - response
   * @memberof Helper
   */
  static async createUser(options) {
    const response = await http.request({
      baseUrl,
      path: `${routerPrefix}/users`,
      method: 'post',
      body: options,
    });

    return response;
  }

  /**
   *
   *
   * @static
   * @param {{userId: string}} options - options
   * @returns {{data: object, status: number, headers: object}} - response
   * @memberof Helper
   */
  static async getUser(options) {
    const response = await http.request({
      baseUrl,
      path: `${routerPrefix}/users/${options.userId}`,
      method: 'get',
    });

    return response;
  }

  /**
   *
   *
   * @static
   * @param {{userId: string}} userId - userId
   * @param {{name: string, dob: string, address: string, description: string}} options - options
   * @returns {{data: object, status: number, headers: object}} - response
   * @memberof Helper
   */
  static async updateUser(userId, options) {
    const response = await http.request({
      baseUrl,
      path: `${routerPrefix}/users/${userId}`,
      method: 'put',
      body: options
    });

    return response;
  }

  /**
   *
   *
   * @static
   * @param {{userId: string}} userId - userId
   * @returns {{data: object, status: number, headers: object}} - response
   * @memberof Helper
   */
  static async deleteUser(userId) {
    const response = await http.request({
      baseUrl,
      path: `${routerPrefix}/users/${userId}`,
      method: 'delete',
    });

    return response;
  }

  /**
   *
   *
   * @static
   * @returns {mongoose.ObjectId} - object id
   * @memberof Helper
   */
  static generateObjectIdToString() {
    return mongoose.Types.ObjectId().toString();
  }
}

module.exports = Helper;
