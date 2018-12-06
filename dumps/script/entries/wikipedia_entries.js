function extractWords()
{
  var mwParserOutput = document.getElementsByClassName('mw-parser-output')[0];

  var wordsBlock = mwParserOutput.getElementsByTagName('p');

  var result = [];

  for(var wordsBlockIndex = 0; wordsBlockIndex < wordsBlock.length; wordsBlockIndex++)
  {
    let wordsTag = wordsBlock[wordsBlockIndex].getElementsByTagName('a');

    for(var wordsTagIndex = 0; wordsTagIndex < wordsTag.length; wordsTagIndex++)
    {
      let word = wordsTag[wordsTagIndex].textContent;

      result.push(word);
    }
  }

  return result;
}
