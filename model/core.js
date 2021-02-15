/* eslint-disable no-param-reassign */

exports.save = async (collection, data) => {
  const now = Date.now();
  data.createdAt = now;
  data.updatedAt = now;

  const result = await collection.save(data);
  return result;
}
