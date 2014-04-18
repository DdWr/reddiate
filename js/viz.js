(function(){

  var N = 250; //Data count to store in each buffer
  var data = []; //Data buffer
  var prevNodeTime = 0; //Time from the last frame in which an object was created
  var counter = 0;

  var stage = new Kinetic.Stage({
    container: 'stage',
    width: 800,
    height: 800
  });

  //Create root layer and add it to the canvas
  var rootLayer = new Kinetic.Layer();
  stage.add(rootLayer);

  //Start animation sequence
  function start(){

    //Animate first object
    if(counter == 0){
      var node = data[0];

      //Create visual representation
      var circle = new Kinetic.Circle({
        x: stage.width() / 2,
        y: stage.height() / 2,
        radius: 70,
        fill: 'red',
        stroke: 'black',
        strokeWidth: 4
      });

      counter++;
    }

    //Set root layer to be drawn to
    rootLayer.add(circle);

    var amplitude = 150;

    var period = 2000; //ms

    var centerX = stage.width() / 2;

    var anim = new Kinetic.Animation(function(frame) {
    circle.setX(amplitude * Math.sin(frame.time * 2 * Math.PI / period) + centerX);
    }, rootLayer);

    anim.start();
  }

  /* Fetch data from server to be rendered */
  function loadData(sub_id){
    $.ajax({
      type: "POST",
      url: "php/fetchData.php",
      success: function(data){
        alert(":D");
      }
    });
  }

  /* Bind functions to outer scope */
  window.start = start;
  window.loadData = loadData;
})();

