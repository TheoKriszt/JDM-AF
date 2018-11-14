const HTMLParser = require('node-html-parser');

const RelationHelper = require('./relation_helper');

const DefinitionHelper = require('./definition_helper');

const clone = require('clone');

(function()
{
  module.exports.extractSearchResult = function(tagCode)
  {
    let searchResult = {
      'word': {
        'weight' : 0,
        'id' : 0 ,
        'type' : 0,
        'text' : ''
      },
      'formatedWord': '',
      'definitions': [],
      'relationsOut' : [],
      'relationsIn' : [],
    };

    let root = HTMLParser.parse(tagCode);

    let wordTag = root.querySelector('mot');

    if(wordTag != null) {
      searchResult.word.weight = wordTag.rawAttributes['poids'];
      searchResult.word.id = wordTag.rawAttributes['id'];
      searchResult.word.type = wordTag.rawAttributes['type'];
      searchResult.text = wordTag.childNodes[0].rawText;
    }

    let formatedWordTag = root.querySelector('mot-formate');

    if(formatedWordTag != null)
      searchResult.formatedWord = formatedWordTag.text;

    let definitionTag = root.querySelector('def');

    if(definitionTag != null)
      searchResult.definitions = clone(DefinitionHelper.extractDefinition(definitionTag));

    let tagRelationOut = root.querySelector('sortant');

    if(tagRelationOut != null)
    {
      let relationOutEntries = tagRelationOut.toString().split('\n');

      for (let index = 0; index < relationOutEntries.length; index++)
      {
        let relationOut = clone(RelationHelper.extractRelation(relationOutEntries[index]));

        if(relationOut != null)
        {
          let relationIndex = 0;
          let relationExist = false;

          for(relationIndex = 0; relationIndex < searchResult.relationsOut.length; relationIndex++)
            if (searchResult.relationsOut[relationIndex].relationType === relationOut.type)
            {
              relationExist = true;

              break;
            }

          if(relationExist)
            searchResult.relationsOut[relationIndex].values.push(clone(relationOut));
          else
            searchResult.relationsOut.push({'relationType': clone(relationOut.type), 'values': [clone(relationOut)]});
        }
      }
    }

    let tagRelationIn = root.querySelector('entrant');

    if(tagRelationIn != null)
    {
      let relationInEntries = tagRelationIn.toString().split('\n');

      for (let index = 0; index < relationInEntries.length; index++)
      {
        let relationIn = clone(RelationHelper.extractRelation(relationInEntries[index]));

        if(relationIn != null)
        {
          let relationIndex = 0;
          let relationExist = false;

          for(relationIndex = 0; relationIndex < searchResult.relationsIn.length; relationIndex++)
            if (searchResult.relationsIn[relationIndex].relationType === relationIn.type)
            {
              relationExist = true;

              break;
          }

          if(relationExist)
            searchResult.relationsIn[relationIndex].values.push(clone(relationIn));
          else
            searchResult.relationsIn.push({'relationType': clone(relationIn.type), 'values': [clone(relationIn)]});
        }
      }
    }

    return clone(searchResult);
  };
}());
