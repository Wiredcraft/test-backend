module.exports = () => (req, res, next) => {
  var app = req.app
  var registry = app.registry

  const TokenModel = registry.getModel('WToken')

  TokenModel.findForRequest(req, function (err, token) {
    req.accessToken = token || null
    var ctx = req.loopbackContext
    if (ctx && ctx.active) ctx.set('accessToken', token)
    next(err)
  })
}
