(function() {
  module.exports.extractNodes = function(tagNodes) {
    let nodes = [];

    let clearedTag = tagNodes.substring(tagNodes.indexOf('\n\n') + 2, tagNodes.length);

    let tags = clearedTag.split('\n');

    let nodeId = '';
    let name = '';
    let type = '';
    let w ='';

    let parserIndex = 0;

    for(let nodeIndex = 0; nodeIndex < tags.length - 2; nodeIndex++)
    {
      parserIndex = 2;

      nodeId = '';
      name = '';
      type = '';
      w = '';

      while(tags[nodeIndex].charAt(parserIndex) !== ';')
      {
        nodeId += tags[nodeIndex].charAt(parserIndex);

        parserIndex++;
      }

      parserIndex += 2;

      while(tags[nodeIndex].charAt(parserIndex) !== ';')
      {
        name += tags[nodeIndex].charAt(parserIndex);

        parserIndex++;
      }

      parserIndex ++;

      while(tags[nodeIndex].charAt(parserIndex) !== ';')
      {
        type += tags[nodeIndex].charAt(parserIndex);

        parserIndex++;
      }

      parserIndex ++;

      while(parserIndex < tags[nodeIndex].length - 1)
      {
        w += tags[nodeIndex].charAt(parserIndex);

        parserIndex++;
      }

      nodes.push({'nodeId': parseInt(nodeId), 'name': name, 'type': parseInt(type), 'w': parseInt(w)});
    }

    return nodes;
  };
}());
