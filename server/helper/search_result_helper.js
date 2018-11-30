const clone = require('clone');

const DefinitionHelper = require('./definition/definition_helper');
//const NodeTypeHelper = require('./node/node_type_helper');
const NodeHelper = require('./node/node_helper');
const RelationTypeHelper = require('./relation/relation_type_helper');
const RelationHelper = require('./relation/relation_helper');

(function() {
  module.exports.extractSearchResult = function(tags) {

    let tagDefinitions = tags[1];

    let definitions = clone(DefinitionHelper.extractDefinition(tagDefinitions));

    //let tagNodesTypes = tags[2];

    //let nodesTypes = clone(NodeTypeHelper.extractNodeTypes(tagNodesTypes));

    let tagNodes = tags[3];

    let nodes = clone(NodeHelper.extractNodes(tagNodes));

    let tagRelationsTypes = tags[4];

    let relationsTypes = RelationTypeHelper.extractRelationsType(tagRelationsTypes);

    let tagRelationsOut = tags[5];

    let relationsOut = RelationHelper.extractRelations(tagRelationsOut);

    let tagRelationsIn = tags[6];

    let relationsIn = RelationHelper.extractRelations(tagRelationsIn);

    let searchResult = {
      'id': 0,
      'formatedWord': '',
      'definitions': [],
      'relationsOut' : [],
      'relationsIn' : [],
    };

    searchResult.id = nodes[0].id;

    searchResult.definitions = definitions;

    searchResult.relationsOut = RelationHelper.composeRelations(relationsOut, relationsTypes, nodes, 0);

    searchResult.relationsIn = RelationHelper.composeRelations(relationsIn, relationsTypes, nodes, 1);

    return clone(searchResult);
  };

  module.exports.compareRelationsWeight = function compareRelation(a,b)
  {
    if(a.weight > b.weight)
      return -1;
    else if(a.weight < b.weight)
      return 1;
    else
      return 0;
  };

  module.exports.compareRelationsFrenchOrder = function compareRelation(a,b)
  {
    return a.text.localeCompare(b.text, 'fr', {sensitivity: 'base'});
  };

  module.exports.compareAutocompleteFrenchOrder = function compareRelation(a,b)
  {
    return a.localeCompare(b, 'fr', {sensitivity: 'base'});
  };

  module.exports.sortRelations = function compareRelation(searchResult, sort)
  {
    searchResult.relationsIn.forEach(function(relations)
    {
      relations.values.sort(sort);
    });

    searchResult.relationsOut.forEach(function(relations)
    {
      relations.values.sort(sort);
    });
  };

  module.exports.sortAutocomplete = function compareRelation(searchResult, sort)
  {
    console.log("Sort entries for autocomplete");
    console.log(JSON.stringify(searchResult));
    searchResult.sort(sort);
  };

}());
