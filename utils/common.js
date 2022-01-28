module.exports = {
  isNullObject(objectInstance){
    let result = true;
    for(let key in objectInstance){
      result = false;
      break;
    }
    return result;
  }
}
