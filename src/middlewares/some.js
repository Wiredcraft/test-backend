export default function() {
  return (ctx, next) => {
    // write your middleware
    // ctx.state.foo = "something"
    return next();
  };
}
