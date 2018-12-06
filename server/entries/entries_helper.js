const RadixTrie = require('radix-trie');

var fs = require('fs');

const FileHelper = require('../file/file_helper');

(function() {

  module.exports.readJDMEntries = function()
  {
    let data = fs.readFileSync('./data/entries/jdm_entries/jdm_entries_light.txt').toString().split("\n");

    let trie = new RadixTrie();

    console.time("wordEntriesGeneration");

    for(let lineIndex = 0; lineIndex < data.length; lineIndex++)
    {
      let separatorIndex = data[lineIndex].indexOf(';');

      let word = data[lineIndex].substring(separatorIndex + 1, data[lineIndex].length - 1);

      for(let caractereIndex = 1; caractereIndex < word.length; caractereIndex++)
        trie.addWord(word.substring(0, caractereIndex), word);
    }

    console.timeEnd("wordEntriesGeneration");

    return trie;
  };

  module.exports.readWikipediaEntries = function()
  {
    let words = FileHelper.fileToJSONObject('./data/entries/wikipedia_entries/wikipedia_entries.json');

    let trie = new RadixTrie();

    console.time("wordEntriesGeneration");

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
