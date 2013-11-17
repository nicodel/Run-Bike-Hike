/* chrono.js
 * Role : simule un chronometre et affiche le temps ecoule
 * Projet : JsLib
 * Auteur : Etienne CHEVILLARD (echevillard@users.sourceforge.net)
 * Version : 1.4
 * Creation : 25/04/2001
 * Mise a jour : 12/12/2007
 */

// --- Variables globales ---

// variables pour la gestion du chronometre
var chrono_demarre=false;
var chrono_ecoule=0;
var chrono_depart=0;
var chrono_dernier=0;

// variables pour la mise a jour dynamique
var chrono_champ;
var chrono_timeout;

// --- Fonctions ---

// indique si le chronometre est demarre ou non
function actifChrono() {
	return (chrono_demarre);
} // fin actifChrono()

// arrete le chronometre
function arreterChrono() {
	if (chrono_demarre) {
		chrono_dernier=(new Date()).getTime();
		chrono_ecoule+=(chrono_dernier-chrono_depart);
		chrono_demarre=false;
	}
	return true;
} // fin arreterChrono()

// active la mise a jour dynamique du temps mesure pour le champ specifie
function chargerChronoDyna(champ) {
	if (champ)
		chrono_champ=eval(champ);
	chrono_champ.value=tempsChrono();
	chrono_timeout=window.setTimeout("chargerChronoDyna()", 10);
	return true;
} // fin chargerChronoDyna(champ)

// desactive la mise a jour dynamique du temps mesure precedemment activee
function dechargerChronoDyna() {
	window.clearTimeout(chrono_timeout);
	return true;
} // fin dechargerChronoDyna()

// demarre le chronometre
function demarrerChrono() {
	if (!chrono_demarre) {
		chrono_depart=(new Date()).getTime();
		chrono_demarre=true;
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
	var ch=parseInt(cnow.getHours()) - 1;
	var cm=cnow.getMinutes();
	var cs=cnow.getSeconds();
	var cc=parseInt(cnow.getMilliseconds()/10);
	if (cc<10) cc="0"+cc;
	if (cs<10) cs="0"+cs;
	if (cm<10) cm="0"+cm;
	return (ch+":"+cm+":"+cs+":"+cc);
} // fin tempsChrono()
