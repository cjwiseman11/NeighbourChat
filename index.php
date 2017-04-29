<!doctype html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta http-equiv="Content-Type" content="text/html">
	<meta name="author" content="Chris Wiseman">
	<title>Neighbour Yo!</title>
    <link href="https://fonts.googleapis.com/css?family=Comfortaa" rel="stylesheet">
    <link href="css/bulma.css" rel="stylesheet">
    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
    <script src="js/lookup.js"></script>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font: 13px Helvetica, Arial; }
      form { background: #000; padding: 3px; position: fixed; bottom: 0; width: 100%; }
      form input { border: 0; padding: 10px; width: 90%; margin-right: .5%; }
      form button { width: 9%; background: rgb(130, 224, 255); border: none; padding: 10px; }
      #messages { list-style-type: none; margin: 0; padding: 0; }
      #messages li { padding: 5px 10px; }
      #messages li:nth-child(odd) { background: #eee; }
    </style>
</head>
<body>
    <div class="content container">
        <h1>Neighbour Chat
        <small>Friendly, anonymous neighbour chat</small></h1>
        <form id="#postcode_lookup">
            <div class="field">
                <label class="label">Postcode</label>
                <p class="control">
                    <input class="pcinput input" type="text" placeholder="Text input">
                </p>
            </div>
            <button id="lookup" class="button is-primary" onclick="return false;">Submit</button>
        </form>
    <ul id="messages"></ul>
    <form action="">
    <input id="m" autocomplete="off" /><button>Send</button>
    </form>
    <script src="/socket.io/socket.io.js"></script>
    <script src="https://code.jquery.com/jquery-1.11.1.js"></script>
    <script>
    $(function () {
        var socket = io();
        $('form').submit(function(){
        socket.emit('chat message', $('#m').val());
        $('#m').val('');
        return false;
        });
        socket.on('chat message', function(msg){
        $('#messages').append($('<li>').text(msg));
        });
    });
    </script>
    </div>
</body>
</html>