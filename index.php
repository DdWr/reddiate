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
        <label class="control-label">Clamp Factor (%)</label>
        <input type="text" id="clampFactor" class="form-control" placeholder="Clamping factor (0-1)" value=".3"/><br />
        <label class="control-label">Node radius</label>
        <select id="nodeRadius" class="form-control">
            <option value="ups">Upvotes</option>
            <option value="downs">Downvotes</option>
            <option value="score">Score</option>
            <option value="num_comments"># Comments</option>
          </select><br />
        <input type="button" id="updateBtn" class="btn btn-primary" value="Update" />
    </div>
    <div id="playbackCtrls">
      <span id="playBtn" class="glyphicon glyphicon-pause"></span>
      <div id="progress"></div>
      <span id="progLabel"></span>
    </div>
    <script type="text/javascript" src="js/viz.js"></script>
    <script type="text/javascript">
      loadData("none");

      $("#inputBtn").click(function(e){
        $("#inputParams").fadeToggle(200);
      });

      $("#updateBtn").click(function(e){
        nodeAngleParam = $("#nodeAngle option:selected").val();
        nodeRadiusParam = $("#nodeRadius option:selected").val();
        clampFactor = $("#clampFactor").val();
        if(clampFactor > 1){
          alert("Please enter a clamp factor between 0 and 1");
          return;
        }
        switch(nodeAngleParam){
          case "ups":
            minAngleParam = parseInt(minUps);
            maxAngleParam = parseInt(maxUps);
          break;
          case "downs":
            minAngleParam = parseInt(minDowns);
            maxAngleParam = parseInt(maxDowns);
          break;
          case "num_comments":
            minAngleParam = parseInt(minComments);
            maxAngleParam = parseInt(maxComments);
          break;
          case "ups":
            minAngleParam = parseInt(minScore);
            maxAngleParam = parseInt(maxScore);
          break;
        }
         switch(nodeRadiusParam){
          case "ups":
            minRadiusParam = parseInt(minUps);
            maxRadiusParam  = parseInt(maxUps);
          break;
          case "downs":
            minRadiusParam = parseInt(minDowns);
            maxRadiusParam  = parseInt(maxDowns);
          break;
          case "num_comments":
            minRadiusParam = parseInt(minComments);
            maxRadiusParam  = parseInt(maxComments);
          break;
          case "score":
            minRadiusParam = parseInt(minScore);
            maxRadiusParam  = parseInt(maxScore);
          break;
        }
        $("#lowest").html(minAngleParam);
        $("#highest").html(Math.floor(maxAngleParam * clampFactor));
        start();
      });

      $("#ctrlsBtn").click(function(e){
        $("#playbackCtrls").fadeToggle(200);
      });

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


    </script>
  </body>
</html>