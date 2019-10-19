exports.success = ({ ctx, res = {}, status = 200, msg = 'success' }) => {
    ctx.body = {
        msg, ...res
    }
    ctx.status = status
}

exports.error = ({ ctx, err = {}, status = 500, msg = 'failed' }) => {
    ctx.body = {
        msg, err,
    }
    ctx.status = status
}
