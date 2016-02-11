# Run, Bike, Hike...

## Description

A GPS recording web app.
Run, Bike, Hike... allow you to record your running or biking sessions, so you can follow your sporting progress. You can be a running expert or an occasional hiker, Run, Bike, Hike... is giving simple and essentials functionalities. During tracking, you can see the elapsed time, the distance traveled, the altitude. And once record is made, you can see your track on a map, your average speed, maximum altitude. Speed and altitude evolution are shown on a graph giving you a better understanding of given efforts. Tracks can also be send trough email, or save on your device as GPX files.
Sports Log is a personal sports log that can be hosted on your [Cozy](https://cozy.io) or [Node.js](https://nodejs.org) server. It gives you a unique place where to store your sports sessions, follow your evolution...

# How to install Sports Log in my Cozy instance?

If you already have a Cozy instance setup, then you ~~can~~ will be able to install Sports Log either
from the Marketplace or by hopping on the machine and running the following
command:

```cozy-monitor install sportslog -r https://github.com/nicodel/sportslog```

# How to install Sports Log on a Node server?

Sports Log can run in a [Node.js](https://nodejs.org) server. To do so, run the following
command:

```
git clone https://github.com/nicodel/sportslog
cd sportslog
npm install
npm start
```

## Hack

If you want to hack on Sports Log, be sure to have installed [Mocha](https://mochajs.org) on your
machine. It is used fot testing.

```npm install -g mocha```

(of course, install dependencies for the application)

```npm install```

Then you can start Sports Log this way:

```npm start```

### Can i propose a pull request?

Oh yeah, that'd be awesome! If you think about it, create a branch on your fork
and if you feel like sending a pull request, please propose to merge into the
`incoming` branch (not `master`). Then I'll give it a look and will most
certainly accept it!

## What is Cozy?

![Cozy Logo](https://raw.github.com/cozy/cozy-setup/gh-pages/assets/images/happycloud.png)

[Cozy](https://cozy.io) is a platform that brings all your web services in the
same private space.  With it, your web apps and your devices can share data
easily, providing you with a new experience. You can install Cozy on your own
hardware where no one profiles you.

## Installation
* Stable:
* Under development:

## Build from source

Run, Bike, Hike... is now based on npm for testing sources and building packages. In order to install all necessary packages, you need to run `npm install`.
You will only be able to run Run, Bike, Hike... in a browser from `/public` folder.

## Release notes

### v0.2.0 - xx/xx/xxxx

### v0.1.18 - 29/06/2015
* Fix issue #97: Exporting tracks to file regression bug was fixed.
* Fixing spanish localization issues.

### v0.1.17 - 18/06/2015
* Fix issue #97: Exporting tracks to file regression bug was fixed.
* Fix issue #104: In track detail view, map would get over graphs on some display. Corrected.
* Fix issue #110: Distance is not rounded anymore, if greater than 10.

### v0.1.16 - 04/06/2015
* Fix issue: old tracks managment.

### v0.1.15 - 25/05/2015
* Fix issue #93: Replace single quote by double quote to allow exported files to be imported in RunKeeper.
* Fix issue #37: Better multi-segments track managment, when importing files recorded with another device.
* Fix issue #98: Altitude and speed graphs are now displayed with respect of the timeline.
* Add feature: Timeless tracks details are displayed correctly.
* Fix issue #106: Replace MapQuest static map service by OpenStreetMap map.

### v0.1.14 -
* Fix issue: Maq Quest API new token.

### v0.1.13 -
* Fix issue: More than 2 storage units.

### v0.1.12 -
* New language: German.
* Add feature #67: Better managment of device with multiple storage.
* Pull request #92: Open information lins in a new window.
* Pull request #91: Fix generated names and duration in impored tracks.
* Pull request #88: Adding decimal into the calcumation ressult of average speed.
* Pull request #84: Fixing removing child nodes on track list.
* Fix Issue #94: Mapquest request failure after API changes.

### v0.1.11 - 15/12/2014
* New language: Español.
* Fix issue #76: Elapsed time depending on timezone.
* Fix issue #77: Shared-by-email GPX file [Bug 1111724](https://bugzilla.mozilla.org/show_bug.cgi?id=1111724).
* Fix issue #73: Time not displayed in graph anymore.

### v0.1.10 - 11/12/2014
* Build process fixed.

### v0.1.9 - 08/12/2014
* Various locales fixed.

### v0.1.8 - 06/12/2014
* Add feature #30: Add import button (and give user the possibility to import tracks with GPX format file).
* Add feature #37: Ability to pause the ride (PR #60).
* Add feature #28: Let the user choose GPS refresh rate (PR #61).
* Fix issue #26 (again)...

### v0.1.7 - 06/11/2014
* Fix issue #25: Hours on stats graph are sometime cut.
* Fix issue #26: Average speed calculation error.
* Add feature #27: Adding version, contributors, credits and licence informations to Setting View.
* Add feature #33: Identify the type of sport done while recording track.
* Fix issue #36: Clean up git repository.
* Pull request #49: Make "Retreiving GPS signal" more readable.
* Pull request #50: Use full page height.
* Pull request #51: Avoid having scrollbar on main view with 320x480 display (eg: Keon).
* Issue #33 & Pull requests #35, #38: Identify the type of sport used during a recorded track.

### v0.1.6 - 01/10/2014
* correcting sharing bug... again and finally.
* adding map picture to email sharing.

### v0.1.5 - 30/09/2014
* sharing through emails and sd-card bugs corrected.

### v0.1.4 - 29/09/2014
* initial market place version.
* Device position is shown, along with altitude and direction (if moving).
* Informations shown during tracking are speed, altitude, accuracy and elapsed time.
* Movements can be recorded. Informations recorded are longitude, latitude, altitude, direction, speed and accuracy.
* Tracks are recorded on device using IndexedDB.
* Stored tracks can be renamed.
* Stored tracks can be deleted.
* Position and date format can be choosen in Settings, as well as distance unit.
* Screen keep alive can be choosen in Settings.
* Stored tracks can be exported to GPX or HTML format, and saved locally or sent through email.
* Available language : English, French.

## Licence
Run, Bike, Hike... is distributed under the [MPL2.0 licence](http://www.mozilla.org/MPL/2.0/)
