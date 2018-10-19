const fs = require('fs');

(function() {

  module.exports.fileToJSONObject = function(file)
  {
    try {
      return JSON.parse(fs.readFileSync(file, 'utf8'));
    }
    catch(error)
    {
      return null;
    }
  };

  module.exports.JSONObjectTofile = function(fileName, content)
  {
    fs.writeFileSync(fileName, JSON.stringify(content), 'utf8');
  }
}());
