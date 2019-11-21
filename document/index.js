const resolve = require('json-refs').resolveRefs;
const YAML = require('yaml-js');
const fs = require('fs');
const path = require('path');

const entry = path.join(__dirname, 'entry.yml');
const output = path.join(__dirname, 'api.json');
const root = YAML.load(fs.readFileSync(entry).toString());
// console.log(root);
const options = {
  filter: ['relative', 'remote'],
  loaderOptions: {
    processContent: (res, callback) => {
      callback(null, YAML.load(res.text));
    }
  }
};
resolve(root, options).then(results => {
  fs.writeFileSync(output, JSON.stringify(results.resolved, null, 2));
});
