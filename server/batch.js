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
const DOWNLOAD_FROM_WIKIPEDIA_ENTRIES_IF_BELOW = 100; // Si moins de X entries en HDD
const MAX_ENTRIES_TO_GET_FROM_WIKIPEDIA = 10; // Télécharger au plus Y entries depuis wikipedia_entries (en random)

function downloadWord(word, entriesPath) {

  let formatedUrl = 'http://www.jeuxdemots.org/rezo-dump.php?gotermsubmit=Chercher&gotermrel=' + word + '&rel=';

  console.log('GET ==> ' + formatedUrl);

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

      FileHelper.JSONObjectTofile(entriesPath + '/' + word + '.json', searchResult);
      console.log('wrote "' + word + '" at ' + entriesPath + '/' + word + '.json');
    })

  }).on("error", (error) => {
    console.log("Error : " + error.message);
  }).setTimeout( HTTP_REQUEST_TIMEOUT, () => {
    console.log('JDM API timeout');
  });

}

function downloadIfExpired(word, entriesPath) {
  const stats = fs.statSync(entriesPath + '/' + word + '.json');

  let fileCreationDate = new Date(stats.ctime);
  let timeDifference = Math.abs(new Date().getTime() - fileCreationDate.getTime());
  let daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
  console.log(word + ' is ' + daysDifference + ' days old : ' + (daysDifference > EXPIRATION_DAYS ? 'updating...' : 'nothing to do'));

  if (daysDifference > EXPIRATION_DAYS) {
    downloadWord(word, entriesPath);
  }


}

function run()
{

  const cwd = __dirname.split('\\').join('/');
  let dir = cwd.substring(0, cwd.lastIndexOf('server'));
  if (!dir.endsWith('/')) dir += '/'; //add trailing slash
  const entriesPath = dir + 'data/search_result';

  console.log('Current working dir : ', cwd);

  fs.readdir(entriesPath, (err, files) => {
    if (err){
      console.error(err);
      return;
    }

    if (!files) {
      console.error('aucune entrée à mettre à jour');
      return;
    }else {
      console.log(files.length + ' entrées à mettre à jour');
    }

    let allFiles = [];
    files.forEach(file => {
      allFiles.push( file.substring(0, file.indexOf('.')) );
    });

    let wordsToProcess = allFiles;

    while(wordsToProcess.length > 0){
      const word = wordsToProcess[0];
      wordsToProcess.splice(0, 1);
      downloadIfExpired(word, entriesPath);
    }

    if (allFiles.length < DOWNLOAD_FROM_WIKIPEDIA_ENTRIES_IF_BELOW){
      let mostFrequentWords = fs.readFileSync(dir + 'data/entries/wikipedia_entries/wikipedia_entries.json');
      mostFrequentWords = JSON.parse(mostFrequentWords);
      // console.log(mostFrequentWords);

      let wordsToProcess = [];

      for (let i = 0; i < MAX_ENTRIES_TO_GET_FROM_WIKIPEDIA; i++){
        const randIndex = Math.floor(Math.random() * mostFrequentWords.length);
        const randWord = mostFrequentWords[randIndex];
        // console.log('randIndex : ', randIndex);
        // console.log('randWord : ', randWord);
        if (wordsToProcess.indexOf(randWord) < 0 && allFiles.indexOf(randWord) < 0){
          wordsToProcess.push( randWord );
        }
      }

      for (let word of wordsToProcess) {
        // console.log('downloading ' + word);

        try {
          downloadWord(word, entriesPath);
        }catch (e) {
          console.error(e)
        }
      }


    }

  });
}

run();
