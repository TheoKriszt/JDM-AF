/**
 * BATCH PROCESS
 * Script d'import / màj par lot (à lancer via CRON vers 3-4 h du mat')
 * TODO : implémenter les fonctions, cf README.md
 */

const NodeCache = require( "node-cache" );
const wordCache = new NodeCache(); //word -> json

/*
  Foreach fichier dans le cache
    Retelecharger le fichier
 */
