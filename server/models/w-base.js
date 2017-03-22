import { app } from '../server'

module.exports = WBase => {
  WBase.observe('before save', (ctx, next) => {
    if (ctx.isNewInstance && ctx.instance) {
      // Add Created timeinfo
      Object.assign(ctx.instance, {'created_at': new Date()})
      next()
    } else if (ctx.instance.id) {
      const { WUser } = app.models

      WUser.findById(ctx.instance.id, (err, user) => {
        if (err) next(err)
        // Update Modified and Created timeinfo
        Object.assign(ctx.instance,
          {
            'created_at': user.created_at || new Date(),
            'modified_at': new Date()
          })
        next()
      })
    } else {
      next()
    }
  })
}
