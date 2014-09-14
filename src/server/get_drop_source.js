var fs = require('fs')
  , ejs = require('ejs')
  , path = require('path')

module.exports = function(slug, locals) {
  var productsPath = path.join(__dirname, '..', '..', 'products');
  var dropPath = path.join(productsPath, slug, 'drop.ejs')
  var template = fs.readFileSync(dropPath).toString();
  var source = ejs.render(template, locals || {});
  return source
}
