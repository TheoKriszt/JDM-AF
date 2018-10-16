const RadixTrie = require('radix-trie');

var fs = require('fs');

(function() {

  module.exports.readJDMEntries = function()
  {
    var data = fs.readFileSync('./data/jdm_entries/jdm_entries_light.txt').toString().split("\n");

    let trie = new RadixTrie();

    for(let lineIndex = 0; lineIndex < data.length; lineIndex++)
    {
      let separatorIndex = data[lineIndex].indexOf(';');

      let word = data[lineIndex].substring(separatorIndex + 1, data[lineIndex].length - 1);

      for(let caractereIndex = 1; caractereIndex < word.length; caractereIndex++)
        trie.addWord(word.substring(0, caractereIndex), word);
    }

    console.log('Entries generated');

    return trie;
  };
}());
