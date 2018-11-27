(function() {
  module.exports.extractRelations = function(tagrelations) {
    let relations = [];

    let clearedTag = tagrelations.substring(tagrelations.indexOf('\n\n') + 2, tagrelations.length);

    let tags = clearedTag.split('\n');

    let relationId = '';
    let node1 = '';
    let node2 = '';
    let type = '';
    let w = '';

    let parserIndex = 0;

    for(let relationTypeIndex = 0; relationTypeIndex < tags.length - 2; relationTypeIndex++)
    {
      parserIndex = 3;

      relationId = '';
      node1 = '';
      node2 = '';
      type = '';
      w = '';

      while(tags[relationTypeIndex].charAt(parserIndex) !== ';')
      {
        relationId += tags[relationTypeIndex].charAt(parserIndex);

        parserIndex++;
      }

      parserIndex += 2;

      while(tags[relationTypeIndex].charAt(parserIndex) !== ';')
      {
        node1 += tags[relationTypeIndex].charAt(parserIndex);

        parserIndex++;
      }

      parserIndex++;

      while(tags[relationTypeIndex].charAt(parserIndex) !== ';')
      {
        node2 += tags[relationTypeIndex].charAt(parserIndex);

        parserIndex++;
      }

      parserIndex++;

      while(tags[relationTypeIndex].charAt(parserIndex) !== ';')
      {
        type += tags[relationTypeIndex].charAt(parserIndex);

        parserIndex++;
      }

      parserIndex++;

      while(parserIndex < tags[relationTypeIndex].length - 1)
      {
        w += tags[relationTypeIndex].charAt(parserIndex);

        parserIndex++;
      }

      relations.push({'relationId': parseInt(relationId), 'node1': parseInt(node1), 'node2': parseInt(node2), 'type': parseInt(type), 'w' : parseInt(w)});
    }

    return relations;
  };
}());
