export async function err(ctx: any, next: any) {
  try {
    await next();
  } catch (err) {
    console.log(err);
  }
}