const csvtojsonV2=require("csvtojson");
const csvtojsonV2=require("csvtojson/v2");


(function() {

  module.exports.readJDMEntries = function()
  {
    try {
      var entries = fs.readFileSync('data/jdm_entries/jdm_entries.json', 'utf8');

      var splitedEntries = entries.toString().split(' ');

      console.log(entries);
    }
    catch(error)
    {
      return null;
    }
  };
}());
