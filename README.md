# Run, Bike, Hike...

## La liste des choses à faire

### Fonctionnalités pour le Hackathon

* Suppression d'une trace GPS
* Renommage d'une trace GPS
* Partage d'une trace GPS (exporter en GPX, envoyer par email ou stocker sur le téléphone)
* Partage du résumé d'une trace GPS (résumé regroupant la distance, la durée ... via des réseaux sociaux)

### Fonctionnalités futures

* Possibility to zoom in and out
* Map orientation chosen between North or user direction

### Issues

* Geolocation inside Firefox Mobile
* Speed graph is not centered vertically
* Infos track view toolbar does not look good
* Config.Keep_screen_alive does not survive an application exist and enter
* Track View Map is not displayed after an application restart
* It seems that infos are not properly retreived from the database

## Description

Un outil d'enregistrement GPS pour les sportifs qui aiment suivre leurs évolutions.

## Cas d'utilisation :

* Coureur souhaitant enregistrer ses parcours pour suivre son évolution. Il aura son téléphone dans sa poche, et pourra écouter de la musique pendant toute la course. Il ne reviendra sur l'application qu'une fois sa course terminée.
* Cycliste souhaitant avoir une visibilité de sa route pendant son parcours. Il pourra avoir son téléphone accroché sur son velo,&nbsp; visible, pourra ainsi suivre en temps réel sa direction, vitesse, distance...
* Marcheur nécessitant une visibilité sur sa direction et les routes possibles à emprunter. Le téléphone ne sera consulté&nbsp; qu'en cas de doute sur la route à suivre,&nbsp; pour vérifier la position, l'altitude... Il pourra enregistrer sa position lprs du parcours afin de noter des points d'intérêt

## Fonctionnalités :
* Exporter les parcours enregistrés aux formats standards afin qu'ils puissent être réutiliser par la suite avec d'autres applications.
* Suivre sa position, altitude, vitesse, direction, distance parcourue et temps passé.
* Enregistrer les parcours.
* Visualiser les parcours enregistrés, particulièrement la courbe de vitesse, d'altitude et la visualisation du parcours sur une carte.
* Visualiser sa position en temps réel sur une carte.

## Release notes

### v0.1 — to be defined
* Device position is shown, along with altitude and direction (if moving).
* Informations shown during tracking are speed, altitude, accuracy and elapsed time.
* Movements can be recorded. Informations recorded are longitude, latitude, altitude, direction, speed and accuracy.
* Tracks are recorded on device using IndexedDB.
* Stored tracks can be deleted.
* Position and date format can be choosen in Settings, as well as distance unit.
* Screen keep alive can be choosen in Settings.
* Available language : English.


### v0.2
* Stored tracks can be renamed.
* Stored tracks can be exported to GPX or HTML format, and saved locally or sent through email.
* Tracks list can be sorted by name, date or distance.
* Available language : French, Spanish.

### v0.3
* During tracking, position can be displayed on a resizable and dynamic map.


## Licence

Run, Bike, Hike... is distributed under the [MPL2.0 licence](http://www.mozilla.org/MPL/2.0/)




## Misc

### App Icons
* 2 formats: 128px (Marketplace) et 60px (Appareil)
* Representing a map with a compass, along with a bike a running and hiking shoes
### App Description
* One phrase short description ( catch phrase).
* Two to three phrases long description.
### App Screenshots
* Portrait & Landscape
* Sizes:
** 320x480
** 720x1280