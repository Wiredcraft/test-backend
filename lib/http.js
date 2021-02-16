
const fetch = require('node-fetch');
const queryString = require('querystring');
const _ = require('lodash');

/**
 *
 * @param {object} options - options
 * @param {string} options.baseUrl - base url
 * @param {string} options.path - path
 * @param {string} options.method - method type
 * @param {object} [options.body] - http body
 * @param {object} [options.query] - http query
 * @param {object} [options.headers] - http headers
 * @returns {{data: object, status: number, headers: object}} - http response status & data
 */
module.exports.request = async ({
  baseUrl, path = '', method, query = {}, body = null, headers = null
}) => {
  let newUrl = baseUrl + path;

  const config = {
    method,
    headers: _.isEmpty(headers) ? { 'Content-Type': 'application/json' } : headers,
    redirect: 'manual' // redirect by self
  }

  if (!_.isEmpty(query)) {
    newUrl = `${newUrl}?${queryString.stringify(query)}`;
  }

  if (!_.isEmpty(body)) {
    const contentType = _.get(headers, 'Content-Type', 'application/json');
    let convertedBody;
    if (contentType === 'application/x-www-form-urlencoded') {
      convertedBody = new URLSearchParams();
      Object.entries(body).forEach(([key, value]) => {
        convertedBody.append(key, value);
      });
    } else {
      convertedBody = JSON.stringify(body);
    }

    config.body = convertedBody;
  }

  const response = await fetch(newUrl, config);

  const data = {
    status: response.status,
    headers: response.headers.raw()
  }

  try {
    data.data = await response.json();
  } catch (error) {
    data.data = {
      code: 'unknown',
      message: 'we can not parse response, content-type may be text/html'
    }
  }

  return data;
};
