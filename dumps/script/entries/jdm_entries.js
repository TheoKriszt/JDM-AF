const FileHelper = require('../../../server/file/file_helper');
const clone = require('clone');

let entries = [];

require('fs').readFileSync('../../../data/entries/jdm_entries/jdm_entries.txt', 'utf-8').split(/\r?\n/).forEach(function(line){
  entries.push(line);
});

console.log(entries);

FileHelper.JSONObjectTofile('../../../data/entries/jdm_entries/jdm_entries.json', entries);
