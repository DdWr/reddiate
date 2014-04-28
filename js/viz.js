(function(){

    var N = 250;          //Data count to store in each buffer
    var dataArray = [];   //Data buffer
    var prevNodeTime = 0; //Time from the last frame in which an object was created
    var counter = 0;      //Number of objects processed
    var minTime;          //The lowest time value (for normalization)
    var maxTime;          //The highest time value (for normalization)
    var minScore;
    var maxScore;
    var size = 900;

    //Create stage to draw to
    var stage = new Kinetic.Stage({
        container: 'stage',
        width: size,
        height: size
     });

    //Create root layer and add it to the canvas
    var rootLayer = new Kinetic.Layer();
    stage.add(rootLayer);

    var onScreen;

    //Start animation sequence
    function start(){

        var centerX = stage.width() / 2;
        var centerY = centerX;
        var circle;
        var onScreen = new Kinetic.Group();
        var timeDiff;
        var nextNodeUTC;
        var currNodeUTC;
        var normUTCDiff;

        //Main animation loop
        var anim = new Kinetic.Animation(function(frame) {

            if(counter > 0){
                //Check to see if the normalized time duration between previous item and the next
                timeDiff = (frame.time - prevNodeTime);
                nextNodeUTC = parseInt(dataArray[counter]["created_utc"]);
                currNodeUTC = parseInt(dataArray[counter - 1]["created_utc"]);
                normUTCDiff = normalize(parseInt(minTime) / 100, parseInt(maxTime) / 100, 0, 10, nextNodeUTC - currNodeUTC) * .05;
                //console.log("Normalized time: ", normUTCDiff * .1);
                //console.log("Elapsed time: ", timeDiff);
            }

            //Animate first object
            if(counter == 0 || timeDiff > 1000){

                //Create visual representation
                circle = new Kinetic.Circle({
                    x: stage.width() / 2,
                    y: stage.height() / 2,
                    radius: 0,
                    fill: 'red',
                    stroke: 'black',
                    strokeWidth: 2,
                });

                //Get normalized angle (between 0 and 360)
                circle.angle = normalize(parseInt(minScore), parseInt(maxScore), 0, 360, parseInt(dataArray[counter]["score"]));

                //console.log(circle.angle);
                counter++;

                //Add new object to root layer
                rootLayer.add(circle);

                //Record time that node was added
                prevNodeTime = frame.time;
            }

            //Get array of nodes currently displayed in the layer
            onScreen = rootLayer.getChildren();

            //Iterate over all current objects and increment their position
            for(var i = 0; i < onScreen.length; i++){

                //Modify node parameters based on distance so we don't have to spawn new function objects for each (slow)
                var distanceMoved = Math.sqrt(Math.pow((onScreen[i].x() - centerX), 2) + Math.pow((onScreen[i].y() - centerY), 2));

                onScreen[i].radius((distanceMoved / centerX) * 35);
                onScreen[i].strokeWidth((distanceMoved / centerX) * 5);

                //Start fading out
                if(distanceMoved < centerX && distanceMoved > (centerX - 50)){
                    onScreen[i].opacity(1 - ((distanceMoved - 400) / 50));
                }

                if(distanceMoved > centerX + 20){
                    onScreen[i].hide();
                } else {
                    //Otherwise, keep animating it outward
                    var newX = onScreen[i].x() + 2 * Math.cos(onScreen[i].angle * (Math.PI / 180));
                    var newY = onScreen[i].y() + 2 * Math.sin(onScreen[i].angle * (Math.PI / 180));
                    onScreen[i].setX(newX);
                    onScreen[i].setY(newY);
                }
            }

            if(counter == dataArray.length){
                anim.stop();
            }

        }, rootLayer);

        anim.start();
    }

    /* Fetch data from server to be rendered */
    function loadData(sub_id){
        $.ajax({
            type: "POST",
            url: "php/getData.php",
            success: function(data){
                var json = JSON.parse(data);
                for(var i = 0; i < json["data"].length; i++){
                    dataArray.push(json["data"][i]);
                }

                minTime  = json["minTime"];
                maxTime  = json["maxTime"];
                minScore = json["minScore"];
                maxScore = json["maxScore"];

                //Run animation with data
                start();
            }
        });
    }

    /* Convert any number to be within a specified range */
    function normalize(oldMin, oldMax, newMin, newMax, num){
        var oldRange = oldMax - oldMin;
        var newRange = newMax - newMin;
        var newNum   = ((Math.abs(num - oldMin) * newRange) / oldRange) + newMin;
        return newNum;
    }

    /* Bind functions to outer scope */
    window.start = start;
    window.loadData = loadData;
})();

