const fs = require('fs');
const htmlEntities = require('html-entities').XmlEntities;

(function() {

  module.exports.fileToJSONObject = function(fileName)
  {
    const safeName = htmlEntities.decode(fileName);
    // console.log('recherche de ', safeName);
    try {
      return JSON.parse(fs.readFileSync(safeName, 'utf8'));
    }
    catch(error)
    {
      return null;
    }
  };

  module.exports.JSONObjectTofile = function(fileName, content)
  {
    const safeFilename = htmlEntities.encode(fileName);
    fs.writeFileSync(safeFilename, JSON.stringify(content), 'utf8');
    // fs.writeFileSync(fileName, JSON.stringify(content), 'utf8');
  };
}());
