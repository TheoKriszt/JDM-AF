function extractRelations()
{
  var jdm = document.getElementsByClassName('jdm-level2-block')[0];

  var table = jdm.getElementsByTagName('table');

  var tbody = table[0].tBodies[0];

  var tr = tbody.getElementsByTagName('tr');

  var result = {'types' : []};

  for(var index = 1; index < tr.length; index++)
  {
    var id = undefined;
    var name = undefined;
    var definition = undefined;

    if(tr[index].getElementsByTagName('td')[1] != undefined)
    {
      id = tr[index].getElementsByTagName('td')[1].textContent.trim();

      console.log(id);
    }

    if(tr[index].getElementsByTagName('td')[2] != undefined)
    {
      name = tr[index].getElementsByTagName('td')[2].textContent.trim();

      console.log(name);
    }

    if(tr[index].getElementsByTagName('td')[3] != undefined)
    {
      definition = tr[index].getElementsByTagName('td')[3].textContent;

      console.log(name);
    }
    else
      definition = '';

    if(id != undefined && name != undefined && definition != undefined)
    {
      var relation = {'id' : id, 'name' : name, 'definition' : definition};

      result.types.push(relation);
    }
  }

  return result;
}
