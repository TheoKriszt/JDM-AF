(function() {
  module.exports.extractNodeTypes = function(tagNodesTypes) {
    let nodesTypes = [];

    let clearedTag = tagNodesTypes.substring(tagNodesTypes.indexOf('\n\n') + 2, tagNodesTypes.length);

    let tags = clearedTag.split('\n');

    let nodeType = '';
    let nodeTypeName = '';

    let parserIndex = 0;

    for(let nodeTypeIndex = 0; nodeTypeIndex < tags.length - 2; nodeTypeIndex++)
    {
      parserIndex = 3;

      nodeType = '';
      nodeTypeName = '';

      while(tags[nodeTypeIndex].charAt(parserIndex) !== ';')
      {
        nodeType += tags[nodeTypeIndex].charAt(parserIndex);

        parserIndex++;
      }

      parserIndex += 2;

      while(tags[nodeTypeIndex].charAt(parserIndex) !== '\'')
      {
        nodeTypeName += tags[nodeTypeIndex].charAt(parserIndex);

        parserIndex++;
      }

      nodesTypes.push({'nodeType': parseInt(nodeType), 'nodeTypeName': nodeTypeName});
    }

    return nodesTypes;
  };
}());
