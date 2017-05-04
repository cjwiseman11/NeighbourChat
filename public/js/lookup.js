$(function(){
    $('#lookup').on("click", function(){
        $('#messages').html("");
        $('.shoutbox-area').addClass("is-hidden");
        var postcode = $('.pcinput').val().toLowerCase().replace(/\s/g, '');
        //$.getJSON("https://api.getaddress.io/v2/uk/" + postcode + "?api-key=lq-IdUHPgkqRr__lrbjvjA8429", function(data) {
        $.getJSON("https://api.postcodes.io/postcodes/" + postcode, function(data) {
            console.log( "success" );
        })
        .done(function(data) {
            //var string = data.Addresses[0];
            var string = data.result.parish;
            var nonum = string.replace(/\d+/g, '');
            var nocomma = nonum.replace(/ ,/g , "");
            $('#address').text("Shouting to " + nocomma);
            $('#postode').text(postcode);
            $('.shoutbox-area').removeClass("is-hidden");
            $.get('/checkmessages?postcode=' + postcode, function(results) {
                for (var key in results) {
                    if (results.hasOwnProperty(key)) {
                        var val = results[key];
                        $('#messages').prepend($('<div class="message-body">' + val.message + '<div class="timestamp">' + val.timeposted + '</div></div>'));

                    }
                }
            });
            console.log( "Found" );
        })
        .fail(function() {
            $('#messages').text("Cannot find address. Please try again");
            console.log( "Fail" );
        })
        .always(function() {
            console.log( "Finished" );
        });
    });
});



