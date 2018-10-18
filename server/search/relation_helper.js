const HTMLParser = require('node-html-parser');

(function() {

  let relation =
  {
    'type' : '',
    'weight' : 0,
    'tid' : 0,
    'ted' : 0,
    'text' : ''
  };

  module.exports.extractRelation = function(relationTag) {
    let relationTagSelected = HTMLParser.parse(relationTag).querySelector('rel');

    if(relationTagSelected != null)
    {
      var attributes = relationTagSelected['rawAttrs'].toString().split(' ');

      if(attributes[0] != null)
        relation.type = attributes[0].substring(attributes[0].indexOf('type="') + 6, attributes[0].length - 1);

      if(attributes[1] != null)
        relation.weight = attributes[1].substring(attributes[1].indexOf('poids="') + 7, attributes[1].length - 1);

      if(attributes[2] != null)
        relation.tid = attributes[2].substring(attributes[2].indexOf('tid="') + 5, attributes[2].length - 1);

      if(attributes[3] != null)
        relation.ted = attributes[3].substring(attributes[3].indexOf('te="') + 4, attributes[3].length - 1);

      relation.text = relationTagSelected.rawText;

      return relation;
    }

    return null;
  };
}());
