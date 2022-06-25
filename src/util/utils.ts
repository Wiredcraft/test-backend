export function sleep(ms: number) {
  return new Promise((done) => setTimeout(done, ms));
}

export function validateEmail(email: string) {
  var reg = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,4}$/i;
  if (reg.test(email)) {
    return true;
  }
  return false;
}
