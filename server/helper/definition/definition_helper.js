const clone = require('clone');

(function() {

  module.exports.extractDefinition = function(definitionTag) {
    let result = [];

    if (!definitionTag) return result;

    let splitedDefinitions = definitionTag.toString().split(/(\d+\.)/);

    for(let definitionIndex = 2; definitionIndex < splitedDefinitions.length; definitionIndex += 2)
    {
      let definition = {
        'text': '',
        'examples' : []
      };

      let splitedDefinitionExamples = splitedDefinitions[definitionIndex].toString().split('\n');

      let clearedString = splitedDefinitionExamples[0].trim();

      let endIndex = clearedString.indexOf('<br />');

      if(endIndex === -1)
        endIndex = clearedString.length;

      definition.text = clearedString.substring(0, endIndex).trim();

      for(let exampleIndex = 1; exampleIndex < splitedDefinitionExamples.length; exampleIndex++)
      {
        clearedString = splitedDefinitionExamples[exampleIndex].trim();

        endIndex = clearedString.indexOf('<br />');

        if(endIndex === -1)
          endIndex = clearedString.length;

        let example = clearedString.substring(0, endIndex);

        if(example.length > 0 && example !== '</def>')
          definition.examples.push(example.trim());
      }

      result.push(clone(definition));
    }

    return clone(result);
  }

}());
