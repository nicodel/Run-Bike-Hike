(function() {
  var UglifyJS = require("uglify-js");
  
  var jsFiles = [];

  var result = UglifyJS.minify([ "../js/app.js", "../js/base.js", "../js/controller.js" ], {
    outSourceMap: "out.js.map"
  });
  console.log(result.code);
  console.log(result.map);

})();
