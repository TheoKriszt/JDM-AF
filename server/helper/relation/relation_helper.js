const clone = require('clone');

(function() {
  module.exports.extractRelations = function(tagRelations)
  {
    let relations = [];

    if (!tagRelations) return relations;

    let clearedTag = tagRelations.substring(tagRelations.indexOf('\n\n') + 2, tagRelations.length);

    let tags = clearedTag.split('\n');

    let id = '';
    let node1 = '';
    let node2 = '';
    let type = '';
    let weight = '';

    let parserIndex = 0;


    for(let relationIndex = 0; relationIndex < tags.length - 2; relationIndex++)
    {
      parserIndex = 2;

      id = '';
      node1 = '';
      node2 = '';
      type = '';
      weight = '';

      while(tags[relationIndex].charAt(parserIndex) !== ';')
      {
        id += tags[relationIndex].charAt(parserIndex);

        parserIndex++;
      }

      parserIndex ++;

      while(tags[relationIndex].charAt(parserIndex) !== ';')
      {
        node1 += tags[relationIndex].charAt(parserIndex);

        parserIndex++;
      }

      parserIndex++;

      while(tags[relationIndex].charAt(parserIndex) !== ';')
      {
        node2 += tags[relationIndex].charAt(parserIndex);

        parserIndex++;
      }

      parserIndex++;

      while(tags[relationIndex].charAt(parserIndex) !== ';')
      {
        type += tags[relationIndex].charAt(parserIndex);

        parserIndex++;
      }

      parserIndex++;

      while(parserIndex < tags[relationIndex].length)
      {
        weight += tags[relationIndex].charAt(parserIndex);

        parserIndex++;
      }

      relations.push({'id': parseInt(id), 'node1': parseInt(node1), 'node2': parseInt(node2), 'type': parseInt(type), 'weight' : parseInt(weight)});
    }

    return clone(relations);
  };

  //option : 0 = relationsOut, 1 = relationsIn
  module.exports.composeRelations = function(relations, relationsType, nodes, option)
  {
    let formatedRelations = [];

    let type = '';
    let weight = 0;
    let tid = 0;
    let text = '';

    // console.log('nodes : ', nodes);

    for(let relationIndex = 0; relationIndex < relations.length; relationIndex++)
    {
      type = '';
      weight = 0;
      tid = 0;
      text = '';


      weight = relations[relationIndex].weight;

      for(let relationTypeIndex = 0; relationTypeIndex < relationsType.length; relationTypeIndex++)
      {
        if (relations[relationIndex].type === relationsType[relationTypeIndex].id)
        {
          type = relationsType[relationTypeIndex].name;
          break;
        }
      }

      for(let nodeIndex = 0; nodeIndex < nodes.length; nodeIndex++)
      {
        if(option === 0)
        {
          if (relations[relationIndex].node2 === nodes[nodeIndex].id)
          {
            if(nodes[nodeIndex].formatedName !== undefined)
              text = nodes[nodeIndex].formatedName;
            else
              text = nodes[nodeIndex].name;

            break;
          }
        }
        else {
          if (relations[relationIndex].node1 === nodes[nodeIndex].id)
          {
            if(nodes[nodeIndex].formatedName !== undefined)
              text = nodes[nodeIndex].formatedName;
            else
              text = nodes[nodeIndex].name;

            break;
          }
        }
      }

      let checkRelationIndex = 0;
      let relationExist = false;

      for(checkRelationIndex = 0; checkRelationIndex < formatedRelations.length; checkRelationIndex++)
        if (formatedRelations[checkRelationIndex].relationType === type)
        {
          relationExist = true;

          break;
        }

      if(relationExist) {
        formatedRelations[checkRelationIndex].values.push(clone({'type': type, 'weight': weight, 'text': text}));
      } else {
        formatedRelations.push({'relationType': type, 'values': [clone({'type': type, 'weight': weight, 'text': text})]});
      }

    }

    return clone(formatedRelations);
  };

}());
