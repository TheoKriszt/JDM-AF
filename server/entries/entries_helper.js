const RadixTrie = require('radix-trie');

var fs = require('fs');

const FileHelper = require('../file/file_helper');

(function()
{
  module.exports.readEntries = function(fileName)
  {
    let words = FileHelper.fileToJSONObject(fileName);

    let trie = new RadixTrie();

    console.time("wordEntriesGeneration");
    if (words)
    for(let wordIndex = 0; wordIndex < words.length; wordIndex++)
      trie.addWord(words[wordIndex], words[wordIndex]);

    console.timeEnd("wordEntriesGeneration");

    return trie;
  };

  module.exports.readRelationsEntry = function()
  {
    let relations = FileHelper.fileToJSONObject('./data/jdm_relations/jdm_relations.json.back');

    let trie = new RadixTrie();

    console.time("relationsEntriesGeneration");

    for(let wordIndex = 0; wordIndex < relations.length; wordIndex++)
      trie.addWord(relations[wordIndex].name, relations[wordIndex].name);

    console.timeEnd("relationsEntriesGeneration");

    return trie;
  };
}());
