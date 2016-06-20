/* jshint browser: true, strict: true, devel: true */
/* exported Chrono */

/* chrono.js
 * Role : simule un chronometre et affiche le temps ecoule
 * Projet : JsLib
 * Auteur : Etienne CHEVILLARD (echevillard@users.sourceforge.net)
 * Version : 1.4
 * Creation : 25/04/2001
 * Mise a jour : 12/12/2007
 * Updated to a module by Nicolas Delebecque on November 2013
 */

var Chrono = function() {
  "use strict";
	// --- Variables globales ---

	// variables pour la gestion du chronometre
	var chrono_demarre=false;
	var chrono_ecoule=null;
	var chrono_depart=null;
	var chrono_dernier=null;
  // var pause = false;

	// variables pour la mise a jour dynamique
	var chrono_champ;
	var chrono_timeout;

	// --- Fonctions ---

	// indique si le chronometre est demarre ou non
	// function actifChrono() {
		// return (chrono_demarre);
	// } // fin actifChrono()

	// arrete le chronometre
	function arreterChrono() {
		if (chrono_demarre) {
			chrono_dernier=(new Date()).getTime();
			
      chrono_ecoule+=(chrono_dernier-chrono_depart);
			chrono_demarre=false;
		}
		RAZChrono();
		return true;
	} // fin arreterChrono()

	// active la mise a jour dynamique du temps mesure pour le champ specifie
	function chargerChronoDyna(champ) {
    // if (!pause) {
		  if (champ) {
			  chrono_champ = champ;
      }
		  // console.log("chrono_champ: ", chrono_champ);
		  chrono_champ.textContent = tempsChrono();
		  chrono_timeout=window.setTimeout(chargerChronoDyna, 10);
    // };
		return true;
	} // fin chargerChronoDyna(champ)

	// desactive la mise a jour dynamique du temps mesure precedemment activee
	// function dechargerChronoDyna() {
		// window.clearTimeout(chrono_timeout);
		// return true;
	// } // fin dechargerChronoDyna()

	// demarre le chronometre
	function demarrerChrono() {
		console.log("demarrerChrono;");
		if (!chrono_demarre) {
			chrono_depart=(new Date()).getTime();
			chrono_demarre=true;
			console.log("chrono_demarre: ", chrono_demarre);
		}
		return true;
	} // fin demarrerChrono()

	// remet a zero le chronometre si celui-ci est arrete
	function RAZChrono() {
		if (!chrono_demarre) {
			chrono_ecoule=0;
			chrono_depart=0;
			chrono_dernier=0;
		}
		return true;
	} // fin RAZChrono()

	// retourne le temps mesure par le chronometre au format HH:MM:SS:CC
	function tempsChrono() {
		var cnow;
		if (chrono_demarre) {
			chrono_dernier=(new Date()).getTime();
			cnow=new Date(chrono_ecoule+(chrono_dernier-chrono_depart));
		} else {
			cnow=new Date(chrono_ecoule);
		}
		var ch=cnow.getUTCHours();
		var cm=cnow.getUTCMinutes();
		var cs=cnow.getUTCSeconds();
		// var cc=parseInt(cnow.getMilliseconds()/10);
		// if (cc<10) cc="0"+cc;
		if (cs<10) {cs="0"+cs;}
		if (cm<10) {cm="0"+cm;}
		// return (ch+":"+cm+":"+cs+":"+cc);
		return (ch+":"+cm+":"+cs);
	} // fin tempsChrono()

  function pauseIt() {
		if (chrono_demarre) {
			chrono_dernier=(new Date()).getTime();
			chrono_ecoule+=(chrono_dernier-chrono_depart);
			chrono_demarre=false;
		}
		return true;
  }

  function resume() {
    chrono_depart = (new Date()).getTime();
    chrono_demarre =  true;
    return true;
  }

	return {
		start: demarrerChrono,
		stop: arreterChrono,
		reset: RAZChrono,
		load: chargerChronoDyna,
    pauseIt: pauseIt,
    resume: resume
	};

}();
