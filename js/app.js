"use strict;"
var RunBikeHike = function() {

  document.addEventListener('DOMComponentsLoaded', function(){
    var deck = document.getElementById("views");
    deck.showCard(1);

    // var _ = document.webL10n.get;
    Controller.init()
  });


  // var _ = document.webL10n.get;
  // Controller.init();
 
  if (typeof String.prototype.startsWith != 'function') {
    String.prototype.startsWith = function (str){
      return this.slice(0, str.length) == str;
    };
  };
  if (typeof String.prototype.endsWith != 'function') {
    String.prototype.endsWith = function (str){
      return this.slice(-str.length) == str;
    };
  };
}();
