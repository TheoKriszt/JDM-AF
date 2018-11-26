(function() {
  module.exports.extractRelationsType = function(tagrelationsTypes) {
    let relationsTypes = [];

    let clearedTag = tagrelationsTypes.substring(tagrelationsTypes.indexOf('\n\n') + 2, tagrelationsTypes.length);

    let tags = clearedTag.split('\n');

    let relationTypeId = '';
    let relationTypeName = '';
    let relationTypeGroupName = '';
    let relationTypeHelp = '';

    let parserIndex = 0;

    for(let relationTypeIndex = 0; relationTypeIndex < tags.length - 2; relationTypeIndex++)
    {
      parserIndex = 3;

      relationTypeId = '';
      relationTypeName = '';
      relationTypeGroupName = '';
      relationTypeHelp = '';

      while(tags[relationTypeIndex].charAt(parserIndex) !== ';')
      {
        relationTypeId += tags[relationTypeIndex].charAt(parserIndex);

        parserIndex++;
      }

      parserIndex += 2;

      while(tags[relationTypeIndex].charAt(parserIndex) !== ';')
      {
        relationTypeName += tags[relationTypeIndex].charAt(parserIndex);

        parserIndex++;
      }

      parserIndex++;

      while(tags[relationTypeIndex].charAt(parserIndex) !== ';')
      {
        relationTypeGroupName += tags[relationTypeIndex].charAt(parserIndex);

        parserIndex++;
      }

      parserIndex++;

      while(parserIndex < tags[relationTypeIndex].length - 2)
      {
        relationTypeHelp += tags[relationTypeIndex].charAt(parserIndex);

        parserIndex++;
      }

      relationsTypes.push({'relationTypeId': parseInt(relationTypeId), 'relationTypeName': relationTypeName, 'relationTypeGroupName': relationTypeGroupName, 'relationTypeHelp': relationTypeHelp});
    }

    return relationsTypes;
  };
}());
