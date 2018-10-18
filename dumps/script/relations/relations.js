function extractRelations()
{
  var jdm = document.getElementsByClassName('jdm-level2-block')[0];

  var table = jdm.getElementsByTagName('table');

  var tbody = table[0].tBodies[0];

  var tr = tbody.getElementsByTagName('tr');

  var result = [];

  for(var index = 1; index < tr.length; index++)
  {
    var id = undefined;
    var name = undefined;

    if(tr[index].getElementsByTagName('td')[1] != undefined)
    {
      id = tr[index].getElementsByTagName('td')[1].textContent;

      console.log(id);
    }

    if(tr[index].getElementsByTagName('td')[2] != undefined)
    {
      name = tr[index].getElementsByTagName('td')[2].textContent;

      console.log(name);
    }

    if(id != undefined && name != undefined)
    {
      var relation = {'id' : id, 'name' : name};

      result.push(relation);
    }
  }

  return result;
}
