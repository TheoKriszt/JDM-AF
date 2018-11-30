(function() {
  module.exports.extractRelationsType = function(tagrelationsTypes) {
    let relationsTypes = [];

    let clearedTag = tagrelationsTypes.substring(tagrelationsTypes.indexOf('\n\n') + 2, tagrelationsTypes.length);

    let tags = clearedTag.split('\n');

    let id = '';
    let name = '';
    let groupName = '';
    let help = '';

    let parserIndex = 0;

    for(let relationTypeIndex = 0; relationTypeIndex < tags.length - 2; relationTypeIndex++)
    {
      parserIndex = 3;

      id = '';
      name = '';
      groupName = '';
      help = '';

      while(tags[relationTypeIndex].charAt(parserIndex) !== ';')
      {
        id += tags[relationTypeIndex].charAt(parserIndex);

        parserIndex++;
      }

      parserIndex += 2;

      while(tags[relationTypeIndex].charAt(parserIndex) !== '\'')
      {
        name += tags[relationTypeIndex].charAt(parserIndex);

        parserIndex++;
      }

      parserIndex += 2;

      while(tags[relationTypeIndex].charAt(parserIndex) !== ';')
      {
        groupName += tags[relationTypeIndex].charAt(parserIndex);

        parserIndex++;
      }

      parserIndex++;

      while(parserIndex < tags[relationTypeIndex].length - 2)
      {
        help += tags[relationTypeIndex].charAt(parserIndex);

        parserIndex++;
      }

      relationsTypes.push({'id': parseInt(id), 'name': name, 'groupName': groupName, 'help': help});
    }

    return relationsTypes;
  };
}());
