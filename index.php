<!DOCTYPE HTML>
<html>
  <head>
    <title>Reddiate</title>
    <script src="js/jquery-2.1.0.min.js"></script>
    <script src="js/jquery-ui-1.10.4.min.js"></script>
    <script src="js/kinetic-v5.1.0.min.js"></script>
    <link rel="stylesheet" type="text/css" href="css/style.css" />
    <link rel="stylesheet" type="text/css" href="css/bootstrap.min.css" />
    <link href='http://ajax.googleapis.com/ajax/libs/jqueryui/1.8/themes/base/jquery-ui.css' rel='stylesheet' type='text/css'>
  </head>
  <body>
    <span id="inputBtn" class="glyphicon glyphicon-cog"></span>
    <span id="ctrlsBtn"  class="glyphicon glyphicon-play"></span>
    <img id="guide" src="img/guide.png" />
    <div id="stage"></div>
    <span id="highest"></span>
    <span id="lowest"></span>
    <div id="inputParams" style="text-align: center;">
        <label class="control-label">Node angle</label>
        <select id="nodeAngle" class="form-control">
            <option value="ups">Upvotes</option>
            <option value="downs">Downvotes</option>
            <option value="score">Score</option>
            <option value="num_comments"># Comments</option>
          </select><br />
        <label class="control-label">Angle clamp Factor (%)</label>
        <input type="text" id="angleClampFactor" class="form-control" placeholder="Clamping factor (0-1)" value=".3"/><br />
        <label class="control-label">Node radius</label>
        <select id="nodeRadius" class="form-control">
            <option value="ups">Upvotes</option>
            <option value="downs">Downvotes</option>
            <option value="score">Score</option>
            <option value="num_comments"># Comments</option>
          </select><br />
        <label class="control-label">Radius clamp Factor (%)</label>
        <input type="text" id="radiusClampFactor" class="form-control" placeholder="Clamping factor (0-1)" value=".3"/><br />
        <label class="control-label">Max node radius (px)</label>
        <input type="text" id="maxRadius" class="form-control" placeholder="Node radius (0 - 150)" value="80"/><br />
        <input type="button" id="updateBtn" class="btn btn-primary" value="Update" />
    </div>
    <div id="playbackCtrls">
      <span id="playBtn" class="glyphicon glyphicon-pause"></span>
      <div id="progress"></div>
      <span id="progLabel"></span>
    </div>

    <div id="nodeInfo">
      <img id="nodeThumbnail"/>
      <h4 id="nodeTitle"></h4>
      <div id="nodeAuthor"></div>
      <div id="nodeDate"></div>
      <div id="nodeScore"></div>
      <div id="nodeUpvotes"></div>
      <div id="nodeDownvotes"></div>
      <div id="nodeComments"></div>
      <div id="nodeDomain"></div>
    </div>

    <script type="text/javascript" src="js/viz.js"></script>
    <script type="text/javascript">

      var currMousePos; //Object to hold the current mouse parameters

      loadData(); //Load data and fire off animation

      //Bind handler to update current mouse position for window on mousemove (for node hovering)
      $(document).ready(function(e){
          currMousePos = { x: -1, y: -1 };

      $(document).mousemove(function(event) {
          currMousePos.x = event.pageX;
          currMousePos.y = event.pageY;
      });

      //Show/hide controls for visualization
      $("#inputBtn").click(function(e){
        $("#inputParams").fadeToggle(200);
      });

      //Update visualization parameters and restart
      $("#updateBtn").click(function(e){
        nodeAngleParam    = $("#nodeAngle option:selected").val();
        nodeRadiusParam   = $("#nodeRadius option:selected").val();
        angleClampFactor  = $("#angleClampFactor").val();
        radiusClampFactor = $("#radiusClampFactor").val();
        maxRadius = $("#maxRadius").val();

        if(maxRadius <= 0 || maxRadius >  150){
          alert("Please enter a maximum radius value between 1 and 150");
        }

        if(angleClampFactor > 1 || radiusClampFactor > 1){
          alert("Please enter a clamp factor between 0 and 1");
          return;
        }

        switch(nodeAngleParam){
          case "ups":
            minAngleParam = params["minUps"];
            maxAngleParam = params["maxUps"];
          break;
          case "downs":
            minAngleParam = params["minDowns"];
            maxAngleParam = params["maxDowns"];
          break;
          case "num_comments":
            minAngleParam = params["minComments"];
            maxAngleParam = params["maxComments"];
          break;
          case "score":
            minAngleParam = params["minScore"];
            maxAngleParam = params["maxScore"];
          break;
        }
         switch(nodeRadiusParam){
          case "ups":
            minRadiusParam = params["minUps"];
            maxRadiusParam  = params["maxUps"];
          break;
          case "downs":
            minRadiusParam = params["minDowns"];
            maxRadiusParam  = params["maxDowns"];
          break;
          case "num_comments":
            minRadiusParam = params["minComments"];
            maxRadiusParam  = params["maxComments"];
          break;
          case "score":
            minRadiusParam = params["minScore"];
            maxRadiusParam  = params["maxScore"];
          break;
        }
        $("#lowest").html(minAngleParam);
        $("#highest").html(Math.floor(maxAngleParam * angleClampFactor));
        start();
      });

      $("#ctrlsBtn").click(function(e){
        $("#playbackCtrls").fadeToggle(200);
      });

      //Play button functionality
      $("#playBtn").click(function(e){
        if(!anim.isRunning()){
          anim.start();
          $("#playBtn").attr("class", "glyphicon glyphicon-pause");
        }
        else{
          anim.stop();
          $("#playBtn").attr("class", "glyphicon glyphicon-play");
        }
      });
      });
    </script>
  </body>
</html>