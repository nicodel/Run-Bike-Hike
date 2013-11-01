var trackingInfos = function() {
  function show() {
    _loadListener();
  }
  function update() {}

  function _loadListener() {
    
    /* Stop tracking button */
        document.querySelector("#btn-stop").addEventListener ("click", function () {
      // document.querySelector("#tracking").className = "current";
      // document.querySelector("[data-position='current']").className = "left";
      document.querySelector("#tracking").className = "fade-out";
      document.querySelector("#stop-menu").className = "fade-in";
    });

    /* Stop menu button */
    document.querySelector('#sure-stop-cancel').addEventListener ('click', function () {
      document.querySelector("#stop-menu").className = 'fade-out';
      document.querySelector("#tracking").className = "fade-in";
    });
    document.querySelector("#sure-stop-stop").addEventListener("click", function() {
      console.log("stop clicked");
      stopWatch();
      // document.querySelector("#stop-menu").className = "fade-out";
      // document.querySelector("#home").className = "fade-in";
    });
  }

  return {
    show: show,
    update: update
  };
}();