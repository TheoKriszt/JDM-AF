(function() {
  module.exports.extractNodes = function(tagNodes) {
    let nodes = [];

    let clearedTag = tagNodes.substring(tagNodes.indexOf('\n\n') + 2, tagNodes.length);

    let tags = clearedTag.split('\n');

    let id = '';
    let name = '';
    let type = '';
    let weight = '';
    let formatedName = undefined;

    let parserIndex = 0;

    for(let nodeIndex = 0; nodeIndex < tags.length - 2; nodeIndex++)
    {
      parserIndex = 2;

      id = '';
      name = '';
      type = '';
      weight = '';
      formatedName = undefined;

      while(tags[nodeIndex].charAt(parserIndex) !== ';')
      {
        id += tags[nodeIndex].charAt(parserIndex);

        parserIndex++;
      }

      parserIndex += 2;

      while(tags[nodeIndex].charAt(parserIndex) !== '\'')
      {
        name += tags[nodeIndex].charAt(parserIndex);

        parserIndex++;
      }

      parserIndex += 2;

      while(tags[nodeIndex].charAt(parserIndex) !== ';')
      {
        type += tags[nodeIndex].charAt(parserIndex);

        parserIndex++;
      }

      parserIndex++;

      if(tags[nodeIndex].substring(parserIndex, tags[nodeIndex].length).indexOf(';') !== -1)
      {
        while(tags[nodeIndex].charAt(parserIndex) !== ';')
        {
          weight += tags[nodeIndex].charAt(parserIndex);

          parserIndex++;
        }

        parserIndex += 2;

        formatedName = '';

        while(parserIndex < tags[nodeIndex].length - 1)
        {
          formatedName += tags[nodeIndex].charAt(parserIndex);

          parserIndex++;
        }
      }
      else
        while(parserIndex < tags[nodeIndex].length - 1)
        {
          weight += tags[nodeIndex].charAt(parserIndex);

          parserIndex++;
        }

      nodes.push({'id': parseInt(id), 'name': name, 'type': parseInt(type), 'weight': parseInt(weight), 'formatedName': formatedName});
    }

    return nodes;
  };
}());
