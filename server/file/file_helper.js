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

    try {
      fs.writeFileSync(safeFilename, JSON.stringify(content), 'utf8');
    } catch (e) {
      console.error(e);
    }
  };

  module.exports.checkAvailableSpace = function(limitSpace)
  {
    let totalFilesSpace = 0;

    const cwd = __dirname.split('\\').join('/');
    let dir = cwd.substring(0, cwd.lastIndexOf('server'));

    if (!dir.endsWith('/'))
      dir += '/'; //add trailing slash

    const entriesPath = dir + 'data/search_result';

    let files = fs.readdirSync(entriesPath);

    files.forEach(file =>
    {
      let fileSize = fs.statSync(entriesPath + '/' + file).size / 1000000; // Convert bytes to Mo

      totalFilesSpace += fileSize;
    });

    if (totalFilesSpace > limitSpace) {
      console.log('totalFilesSpace :' , totalFilesSpace, 'Mo' );
      console.log('limitSpace :' , limitSpace , 'Mo' );
    }
    return totalFilesSpace < limitSpace;
  };
}());
