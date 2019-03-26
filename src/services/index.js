const Seneca = require('seneca')
const SenecaWeb = require('seneca-web')
const storage = require('./storage/patterns')
const validator = require('./validator/patterns')
const server = require('./http/handler')
const seneca = Seneca({ debug: { undead: true } })
const dbConnector = require('./storage/connector')
const { port, env, jwt } = require('../config/vars')
const { errorHandler } = require('./http/utils/response')
const logger = require('../config/logger')
async function init () {
  /**
   * Register storage plugin
   */
  await dbConnector()
  seneca.use(storage)

  /**
   * Register validator plugin
   */
  seneca.use(validator)

  /**
 * Register web handler and patterns
 */
  seneca.use(SenecaWeb, server)
  seneca.use(require('./http/patterns'), { secretOrKey: jwt.jwtSecret })

  seneca.ready(() => {
    const app = seneca.export('web/context')()

    /**
     * Handling 404 routes
     */
    app.use('/*', (req, res, next) => {
      return res.json(errorHandler({ err: 'cmd not supported' }))
    })

    app.listen(port, (e) => {
      logger.info(e || `server started on: in ${env} mode on port ${port}`)
    })
  })
}
init()
