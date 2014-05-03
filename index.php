<!DOCTYPE HTML>
<html>
  <head>
    <title>Reddiate</title>
    <style>
      body {
        margin: 0px;
        padding: 0px;
      }
      #title {
        color: #8c8c8c;
        font-family: sans-serif;
        position: absolute;
        padding: 0;
        margin: 0;
        top: 10px;
        left: 10px;
      }
      #stage {
        margin: 50px 0 0 70px;
        width: 900px;
        height: 900px;
        border-radius: 450px;
        background-color: #f7f7f7;
        background-image: url('img/galaxy.jpg');
      }
      #controls {
        margin: 50px 0 70px 70px;
        width: 900px;
        height: 240px;
        background-color: #f7f7f7;
        border: 1px solid #cccccc;
      }
      #guide{
        top: 41px;
        left: 61px;
        position: absolute;
      }
    </style>
    <script src="js/jquery-2.1.0.min.js"></script>
    <script src="js/kinetic-v5.1.0.min.js"></script>

  </head>
  <body>
    <h2 id="title">Reddit Visualization</h2>
    <img id="guide" src="img/guide.png" />
    <div id="stage"></div>
    <div id="controls" style="text-align: center">Controls go here</div>
    <script type="text/javascript" src="js/viz.js"></script>
    <script type="text/javascript">
      loadData("none");
    </script>
  </body>
</html>