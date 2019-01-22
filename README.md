# Jdmaf

## URL
http://www.jeuxdemots.org/rezo-xml.php?gotermsubmit=Chercher&gotermrel=&output=onlyxml

<!---
  Check for detect encoding : https://code.google.com/archive/p/juniversalchardet/
-->

### Serveur : 
  + Autocompletion (lecture du fichier, caractère joker (sufix))
    + [x] Implémenter un __Patricia Tree__ (Arbre radix) pour la recherche
      + [x] (ou juste trouver un package NodeJS qui le fait)
      + [x] Entrées de JDM ou de Wikipedia
  
  + [x] fixe l'encodage ( retester pour le json, encodage  CP1252 ?)
  + ~~[ ] Extraire à la volée les raffinements ( Orange = { Agrume | Télécom | couleur } ) ~~
    + ~~ [ ] Ajouter une entrée _raffinements_ avec les noms courts et IDs des raffinements disponibles ? ~~
  + [x] Charger les tips des relations via [detail relations](http://www.jeuxdemots.org/jdm-about-detail-relations.php)
  
     
  + Scripts de batch 
    + [x] Màj du cache (entrées expirées, Lafourcade vide ~= 1 mois de TTL)
    + [x] DL des mots les plus fréquents du français
    + [x] [Optionnel] Gérer l'espace disque de la persistence (limiter à X Go)
    
  + [x] [Si le nouveau parsing ne met pas types de relations directement dans le mot] Autocompletion des types de relations (r_isa, r_aff, ...)
    + [x] Brancher le service pour servir les types de relation OU extraire depuis le dump du mot
  + [x] [opt.] Donner run timer pour le démarrage du serveur (a chargé les mots en X secondes, démarrage en Y secondes) 
  
  + [x] Decomposer les définitions (titre + exemple), parsage sur $nombre.
  
  + [x] Trier par catégorie les relations (in/out)
  
  + [x] MAJ "automatique" des fichiers dans le cache (disque dur) (batch.js)
  
  + [x] Ajouter les mots recherchés dans le Patricia Tree (Et dans les entries)
  
### Composants angular : 
  + Listes des résultats (retirer l'ambiguité)
    + [x]  [Autocomplete chips](https://material.angular.io/components/chips/overview) pour filtrer les types de relations
      + [x] [opt.] donner un [Tooltip](https://material.angular.io/components/tooltip/overview) pour expliquer le rôle de la relation
        + [ ] Afficher la signification de la relation après son nom
      + [x] Retirer une chip quand elle est déjà sélectionnée (pas 2 fois le même choix)
      + [x] Ajouter un choix **Toutes les relations** qui désactive les autres choix
    + [x] Activer / Désactiver indépendamment relations entrantes et sortantes via [bouton toggle](https://material.angular.io/components/button-toggle/overview)
    + [opt.] Afficher les options de filtre avancées (s'il y en a), planquées dans un [accordéon](https://material.angular.io/components/expansion/examples)
     
  + [ ] Updates du composant recherche (recherche avec paramètres spéciaux : filtre, tri et type relation)
  
  + [ ] Affichage d'un resultat.
    + [ ] Afficher les raffinements possibles s'il y en a
    + [ ] Présenter le résultat de la recherche comme le fait [Diko](http://www.jeuxdemots.org/diko.php), mais en propre
    + [x] Afficher les relations, mais en ~~lazy-loaded pour pas surcharger,~~ comme avec [Tree with dynamic data](https://material.angular.io/components/tree/examples) ==> paginateur
    + [x] Passer directement le mot (l'objet) de words-search à relations-search, pas seulement le mot (string)
    + [ ] Avertir d'un timeout quand jeuxDeMots lag à mort
    + [ ] Donner la source du retour (cache, JDM-rezo)
    
  + [ ] Fonctions de navigation (on fait un genre de navigateur de mots après tout, cf. sujet du partiel)
    + [x] Donner lien cliquable dans les relations
        --> ex : en cherchant "chat" => r_aff_sem => chat>poisson doit mener vers words-search/chat>poisson
    + [ ] Afficher en tête les affinements sémantiques
### Divers
  + [x] Trouver une appellation ou un calembour pour remplacer "f*ck" de JDM-af ==> fuck it
  
### To fix :
+ [x] Le server ne peut pas écrire un fichier du type chat>mammifère.json (caractère '>' interdit).
+ [x] Quand une entrée est fraîchement téléchargée, les relations ne s'affichent pas (Dans mon cas => affiche toutes les relations)
+ [x] Quand la page recharge (on change de terme) : nettoyer le résultat en attendant que le nouveau mot charge
    ==> ex je cherche "chat", OK. Puis je cherche "poisson" mais pendant que ça charge j'ai encore "chat" de marqué
+ [ ] Parfois JDM trouve des définitions et pas nous 
