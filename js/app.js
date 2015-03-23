/* jshint browser: true, strict: true, devel: true */
/* exported _, RunBikeHike */
/* global Controller */
var RunBikeHike = function() {
  "use strict";

  document.addEventListener('DOMComponentsLoaded', function(){
    var deck = document.getElementById("views");
    deck.showCard(1);
    console.log("document.webL10n.getLanguage()", document.webL10n.getLanguage());
    var _ = document.webL10n.get;
    Controller.init();
  });
}();
