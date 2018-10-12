const csv=require('csvtojson');


(function() {

  module.exports.readJDMEntries = async function()
  {
    return csv().fromFile('./data/jdm_entries/jdm_entries.csv');
  };
}());


