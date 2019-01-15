/**
 * BATCH PROCESS
 */

const fs = require('fs');
const iconv  = require('iconv-lite');

const http = require('http');

const RezoSearchResultHelper = require('./helper/search_result_helper');
const FileHelper = require('./file/file_helper');

const EXPIRATION_DAYS = 7;
const HTTP_REQUEST_TIMEOUT = 7000;

function run()
{
  var currentDate = new Date();

  fs.readdir('../data/search_result', (err, files) => {
    files.forEach(file =>
    {
      let word = file.substring(0, file.indexOf('.'));

      console.log(word);

      const stats = fs.statSync('../data/search_result/' + file);

      let fileCreationDate = new Date(stats.ctime);
      let timeDifference = Math.abs(currentDate.getTime() - fileCreationDate.getTime());
      let daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
      console.log('Difference : ' + daysDifference);

      if(daysDifference > EXPIRATION_DAYS) {
        let formatedUrl = 'http://www.jeuxdemots.org/rezo-dump.php?gotermsubmit=Chercher&gotermrel=' + word + '&rel=';

        console.log(formatedUrl);

        http.get(formatedUrl, function (httpResult) {
          let data = [];
          httpResult.on('data', function (chunk) {
            data.push(chunk);
          });

          httpResult.on('end', function () {
            let decodedBody = iconv.decode(Buffer.concat(data), 'win1252');

            let encodedBody = iconv.encode(decodedBody, 'utf8').toString();

            let tagCode = encodedBody.substring(encodedBody.indexOf('<CODE>'), encodedBody.indexOf('</CODE>') + 7); //+7 to add '</code>' into the result

            let tags = tagCode.toString().split('//');

            let searchResult = RezoSearchResultHelper.extractSearchResult(tags);

            searchResult.formatedWord = word;

            RezoSearchResultHelper.sortRelations(searchResult, RezoSearchResultHelper.compareRelationsWeight);

            FileHelper.JSONObjectTofile('../data/search_result/' + word + '.json', searchResult);
          })

        }).on("error", (error) => {
          console.log("Error : " + error.message);
        }).setTimeout( HTTP_REQUEST_TIMEOUT, function( ) {
          console.log('JDM API timeout');
        });
      }
    });
  });
}

run();
