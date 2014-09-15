Controller.init();

document.addEventListener('DOMComponentsLoaded', function(){
  var deck = document.getElementById("views");
  deck.showCard(0);
  TrackView.display(testdata);
});