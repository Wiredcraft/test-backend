const json2Param = (jsonData) => {
  let param = "?" + Object.keys(jsonData).map((key) => {
    return encodeURIComponent(key) + "=" + encodeURIComponent(jsonData[key]);
  }).join("&")
  return param;
}
module.exports = json2Param;