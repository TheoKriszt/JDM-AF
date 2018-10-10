# Jdmaf

## URL
http://www.jeuxdemots.org/rezo-xml.php?gotermsubmit=Chercher&gotermrel=&output=onlyxml


### Serveur : 
  + Autocompletion (lecture du fichier, caractère joker (sufix))
  + fixe l'encodage 
  + Extraire à la volée les raffinements ( Orange = { Agrume | Télécom | couleur } )
    + Ajouter une entrée _raffinements_ avec les noms courts et IDs des raffinements disponibles ?
     
  + Scripts de batch 
    + Màj du cache (entrées expirées)
    + DL des mots les plus fréquents du français
    + [Optionnel] Gérer l'espace disque de la persistence (limiter à X Go)
    
  + Autocompletion des types de relations (r_isa, r_aff, ...)
  
  
### Composants angular : 
  + Listes des résultats (retirer l'ambiguité)
    + cf  [Autocomplete chips](https://material.angular.io/components/chips/overview) pour filtrer les types de relations
      + [opt.] donner un [Tooltip](https://material.angular.io/components/tooltip/overview) pour expliquer le rôle de la relation
    + Activer / Désactiver indépendamment relations entrantes et sortantes via [bouton toggle](https://material.angular.io/components/button-toggle/overview)
    + [opt.] Afficher les options de filtre avancées (s'il y en a), planquées dans un [accordéon](https://material.angular.io/components/expansion/examples)
     
  + Updates du composant recherche (recherche avec paramètres spéciaux : filtre, tri et type relation)
  
  + Affichage d'un resultat.
    + Afficher les raffinements possibles s'il y en a
    + Présenter le résultat de la recherche comme me fait [Diko](http://www.jeuxdemots.org/diko.php), mais en propre
    + Afficher les relations, mais en lazy-loaded pour pas surcharger, comme avec [Tree with dynamic data](https://material.angular.io/components/tree/examples)
    
  
  
### Divers
  + Trouver une appellation ou un calembour pour remplacer "f*ck" de JDM-af






  
