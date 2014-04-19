(function(){

    var N = 250;          //Data count to store in each buffer
    var dataArray = [];   //Data buffer
    var prevNodeTime = 0; //Time from the last frame in which an object was created
    var counter = 0;
    var minTime;
    var maxTime;
    var minScore;
    var maxScore;

    //Create stage to draw to
    var stage = new Kinetic.Stage({
        container: 'stage',
        width: 800,
        height: 800
     });

    //Create root layer and add it to the canvas
    var rootLayer = new Kinetic.Layer();
    stage.add(rootLayer);

    var onScreen;

    //Start animation sequence
    function start(){

        var amplitude = 150;
        var period = 2000; //ms
        var centerX = stage.width() / 2;
        var circle;
        var onScreen = new Kinetic.Group();

        //Main animation loop
        var anim = new Kinetic.Animation(function(frame) {
            //Check to see if next item in array has proportional time elapsed since last frame
            var elapsedTime = 0;

            if(prevNodeTime > 0){
                console.log((frame.time / 1000) - prevNodeTime);
                elapsedTime = normalize(minTime, maxTime, 0, 100, (frame.time / 1000) - prevNodeTime);
            }

            //Animate first object
            if(counter == 0){

                //Create visual representation
                circle = new Kinetic.Circle({
                    x: stage.width() / 2,
                    y: stage.height() / 2,
                    radius: 10,
                    fill: 'red',
                    stroke: 'black',
                    strokeWidth: 2,
                });
                //Get normalized angle (between 0 and 360)
                circle.angle = normalize(parseInt(minScore), parseInt(maxScore), 0, 360, parseInt(dataArray[0]["score"]));

                //console.log(circle.angle);

                counter++;

                //Add new object to root layer
                rootLayer.add(circle);

                //Record time that node was added
                prevNodeTime = frame.time / 1000;

                //console.log("Previous node time: ", prevNodeTime);

            } else {
                //console.log("Elapsed time: ", elapsedTime);
                //console.log("Previous time: ", prevNodeTime);
                //Create visual representation
                circle = new Kinetic.Circle({
                    x: stage.width() / 2,
                    y: stage.height() / 2,
                    radius: 10,
                    fill: 'red',
                    stroke: 'black',
                    strokeWidth: 2,
                });
                //Get normalized angle (between 0 and 360)
                circle.angle = normalize(parseInt(minScore), parseInt(maxScore), 0, 360, parseInt(dataArray[counter]["score"]));

                rootLayer.add(circle);

                //prevNodeTime = frame.time / 1000;

                counter++;
            }

            //Get array of nodes currently displayed in the layer
            onScreen = rootLayer.getChildren();

            //Iterate over all current objects and increment their position
            for(var i = 0; i < onScreen.length; i++){
                //Hide node if it has left bounds
                if(onScreen[i].x() < 0 || onScreen[i].y() < 0){
                    //rootLayer.remove(onScreen[i]);
                } else {
                    //Otherwise, keep animating it outward
                    var newX = onScreen[i].x() + 3 * Math.cos(onScreen[i].angle * (Math.PI / 180));
                    var newY = onScreen[i].y() + 3 * Math.sin(onScreen[i].angle * (Math.PI / 180));
                    onScreen[i].setX(newX);
                    onScreen[i].setY(newY);
                }
            }

            //console.log("counter: " + counter);
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
        //console.log("Old min: ", oldMin, "Old max: ", oldMax, "New min", newMin, "New max", newMax, "Num", num);
        var oldRange = oldMax - oldMin;
        var newRange = newMax - newMin;
        var newNum   = (((num - oldMin) * newRange) / oldRange) + newMin;
        return newNum;
    }

    /* Bind functions to outer scope */
    window.start = start;
    window.loadData = loadData;
})();

