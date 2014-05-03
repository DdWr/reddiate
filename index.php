<!DOCTYPE HTML>
<html>
  <head>
    <title>Reddiate</title>
    <script src="js/jquery-2.1.0.min.js"></script>
    <script src="js/kinetic-v5.1.0.min.js"></script>
    <link rel="stylesheet" type="text/css" href="css/style.css" />
    <link rel="stylesheet" type="text/css" href="css/bootstrap.min.css" />
  </head>
  <body>
    <span id="ctrlsBtn" class="glyphicon glyphicon-cog"></span>
    <span id="playBtn"  class="glyphicon glyphicon-play"></span>
    <img id="guide" src="img/guide.png" />
    <div id="stage"></div>
    <span id="highest"></span>
    <span id="lowest"></span>
    <script type="text/javascript" src="js/viz.js"></script>
    <script type="text/javascript">
      loadData("none");
      $("#ctrlsBtn").click(function(e){
        alert("clicked!");
      });
      $("#playBtn").click(function(e){
        alert("clicked!");
      });
    </script>
  </body>
</html>