/* David Weber
   Reddit Visualization
*/

var domainColors = {};
var N = 250;          //Data count to store in each buffer
var dataArray = [];   //Data buffer
var params = {};
var size = 900;       //Our canvas size
var maxSpeed = 3;     //Maximum speed that objects approach boundary
var maxRadius = 80;
var anim;             //Animation reference
var nodeAngleParam = "ups";
var nodeRadiusParam ="score";
var angleClampFactor = .3;
var radiusClampFactor = 1.0;
var counter = 0;      //Number of objects processed

setDomainColors();    //Create a dictionary of colors for the most popular submission domains

//Create stage to draw to
var stage = new Kinetic.Stage({
    container: 'stage',
    width: size,
    height: size
});

//Create root layer and add it to the canvas
var rootLayer = new Kinetic.Layer();
rootLayer.clicked = false;
stage.add(rootLayer);

$(stage.getContent()).on('click', function(e) {
    if(stage.clicked){
        anim.start();
        stage.clicked = false;
    }
    else{
        anim.stop();
        stage.clicked = true;
    }
});

var onScreen;

//Start animation sequence
function start(){

    var centerX = size / 2;
    var centerY = centerX;
    var circle;
    var onScreen = new Kinetic.Group();
    var timeDiff = 0;
    var nextNodeUTC;
    var currNodeUTC;
    var normUTCDiff;
    var prevNodeTime = 0; //Time from the last frame in which an object was created

    //Clear any child nodes in the canvas
    if(anim != null && anim.isRunning()){
       anim.stop();
       rootLayer.removeChildren();
    }
    //Main animation loop
    anim = new Kinetic.Animation(function(frame) {

        if(counter > 0){
            //Check to see if the normalized time duration between previous item and the next
            timeDiff = (frame.time - prevNodeTime);
            nextNodeUTC = parseInt(dataArray[counter]["created_utc"]);
            currNodeUTC = parseInt(dataArray[counter - 1]["created_utc"]);
            normUTCDiff = normalize(params["minTime"] / 100, params["maxTime"] / 100, 0, 10, nextNodeUTC - currNodeUTC) * .05;
        }

        //Animate first object
        if(counter == 0 || timeDiff >= 80){
            var imageObj = new Image();
            imageObj.onload = function() {
              var image = new Kinetic.Image({
                image: imageObj
              });
            };

            //Set image to thumb if available, otherwise use placeholder
            if(dataArray[counter]["thumbnail"].indexOf("http://") > -1 && dataArray[counter]["thumbnail"] != null){
                imageObj.src = dataArray[counter]["thumbnail"];
            } else{
                imageObj.src = 'img/default_thumb.png';
            }

            //Get domain color
            var strokeColor = domainColors[dataArray[counter]["domain"]];

            //If there isn't a stroke color defined for the domain, make it black
            if(strokeColor == null){
                strokeColor = "#000";
            }

            //Generate random starting position
            var startX, startY;
            startX = getRandomNumber(350, 500);
            startY = getRandomNumber(350, 500);

            //Create visual representation
            circle = new Kinetic.Circle({
                x: stage.width() / 2,
                y: stage.height() / 2,
                radius: 0,
                stroke: strokeColor,
                strokeWidth: 2,
                fillPatternImage: imageObj,
                fillPatternOffset: {x: -50, y: -60}
            });

            var angleParam = dataArray[counter][nodeAngleParam];
            var radiusParam = dataArray[counter][nodeRadiusParam];

            //Clamp this value if it exceeds the clamped maximum
            if(angleParam > params["maxAngleParam"] * angleClampFactor){
                angleParam = params["maxAngleParam"] * angleClampFactor;
            }

            if(radiusParam > params["maxRadiusParam"] * radiusClampFactor){
                radiusParam = params["maxRadiusParam"] * radiusClampFactor;
            }

            //Get normalized angle (between 0 and 360)
            circle.angle = normalize(params["minAngleParam"], params["maxAngleParam"] * angleClampFactor, 0, 360, angleParam);
            circle.maxRadius = normalize(params["minRadiusParam"], params["maxRadiusParam"] * radiusClampFactor, 20, maxRadius, radiusParam);

            //console.log("Max radius: ", circle.maxRadius);

            var node = dataArray[counter];

            circle.on('mouseover', function() {
                //Get mouse coordinates
                var mouseX = currMousePos.x;
                var mouseY = currMousePos.y;
                showInfoForNode(node, mouseX + 20, mouseY + 20, strokeColor, imageObj.src);
            }).on('mouseleave', function() {
                $("#nodeInfo").toggle();
            });

            counter++;

            $("#progress").slider("value", counter);
            $("#progLabel").html(counter + "/" + dataArray.length);

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

            //Radius
            onScreen[i].radius((distanceMoved / centerX) * onScreen[i].maxRadius);

            //Stroke width (max: 3)
            onScreen[i].strokeWidth((distanceMoved / centerX) * 3);

            //Start fading out
            if(distanceMoved < centerX && distanceMoved > (centerX - 50)){
                onScreen[i].opacity(1 - ((distanceMoved - 400) / 50));
            }

            if(distanceMoved > centerX + 20){
                onScreen[i].remove();
            } else {
                //Adjust speed based on distance from center
                var currSpeed = 1 + maxSpeed * (distanceMoved / centerX);
                var newX = onScreen[i].x() + currSpeed * Math.cos(onScreen[i].angle * (Math.PI / 180));
                var newY = onScreen[i].y() + currSpeed * Math.sin(onScreen[i].angle * (Math.PI / 180));
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

            //Extract min and max time interval while processing data
            for(var i = 0; i < json["data"].length; i++){
                dataArray.push(json["data"][i]);
            }

            params["minTime"]     = json["minTime"];
            params["maxTime"]     = json["maxTime"];
            params["minScore"]    = json["maxScore"];
            params["maxScore"]    = json["maxScore"];
            params["minDowns"]    = json["minDowns"];
            params["maxDowns"]    = json["maxDowns"];
            params["minUps"]      = json["minUps"];
            params["maxUps"]      = json["maxUps"];
            params["minComments"] = json["minComments"];
            params["maxComments"] = json["maxComments"];
            params["minAngleParam"] = params["minUps"] ;
            params["maxAngleParam"] = params["maxUps"];
            params["minRadiusParam"] =  params["minUps"]
            params["maxRadiusParam"] =  params["maxUps"]

            $("#lowest").html(params["minUps"]);
            $("#highest").html(params["maxUps"]);
            $("#progress").slider();
            $("#progress").slider("option", "max", dataArray.length);
            $("#progress").on("slide",function(e){
                anim.stop();
                rootLayer.removeChildren();
                counter = $("#progress").slider("value");
                console.log("Counter: ", counter);
                $("#progress").slider("value", counter);
            }).on("slidechange", function(e){
                anim.start();
            });

              //Run animation with data
            start();
        }
    });
}

/* Convert any number to be within a specified range */
function normalize(oldMin, oldMax, newMin, newMax, num){
    var oldRange = oldMax - oldMin;
    var newRange = newMax - newMin;
    var newNum   = (((num - oldMin) * newRange) / oldRange) + newMin;
    return newNum;
}

//Set up colors for top submission domains
function setDomainColors(){
    domainColors["youtube.com"]     = "#e52d27";
    domainColors["youtu.be"]        = "#e52d27";
    domainColors["twitter.com"]     = "#55ACEE";
    domainColors["imgur.com"]       = "#85BF25";
    domainColors["i.imgur.com"]     = "#85BF25";
    domainColors["arstechnica.com"] = "#FF4E00";
    domainColors["bbc.co.uk"]       = "#174f82";
    domainColors["flickr.com"]      = "#ff0084";
    domainColors["self.photography"]= "orangered";
}

function getRandomNumber(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function showInfoForNode(node, x, y, color, src){
    $("#nodeInfo").css({"top": y, "left": x}).toggle();
    console.log(color);
    $("#nodeInfo").css("border-color", color);
    $("#nodeTitle").html(node["title"])
    $("#nodeThumbnail").attr("src", src);
    $("#nodeUpvotes").html("Upvotes: " + node["ups"]);
    $("#nodeDownvotes").html("Downvotes: " + node["downs"]);
    $("#nodeScore").html("Score: " + node["score"]);
    $("#nodeAuthor").html("Posted by: " + node["author"]);
    $("#nodeDate").html("Date: " + convertTime(node["created_utc"]));
}

function convertTime(timestamp){
    var a      = new Date(timestamp*1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year   = a.getFullYear();
    var month  = months[a.getMonth()];
    var date   = a.getDate();
    var hour   = a.getHours();
    var min    = a.getMinutes();
    var sec    = a.getSeconds();
    var time   = month + ' '+ date +',' + year +' '+ hour +':'+min+':'+sec ;
    return time;
 }

/* Bind functions to outer scope */
window.start = start;
window.loadData = loadData;