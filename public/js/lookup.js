$(function(){
    $('#lookup').on("click", function(){
        $('#messages').html("");
        $('.shoutbox-area').addClass("is-hidden");
        $(this).addClass('is-loading');
        var postcode = $('.pcinput').val().toLowerCase().replace(/\s/g, '');
        //$.getJSON("https://api.getaddress.io/v2/uk/" + postcode + "?api-key=lq-IdUHPgkqRr__lrbjvjA8429", function(data) {
        $.getJSON("https://api.postcodes.io/postcodes/" + postcode, function(data) {
            console.log( "success" );
        })
        .done(function(data) {
            $('#postcode_lookup').addClass('is-hidden');
            $('.results').removeClass('is-hidden');
            //var string = data.Addresses[0];
            var string = data.result.parish;
            var nonum = string.replace(/\d+/g, '');
            var nocomma = nonum.replace(/ ,/g , "");
            $('#address').text("Shouting to " + nocomma);
            $('#postcode').html("<strong>" + postcode.toUpperCase() + "</strong>");
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
            $('#lookup').removeClass('is-loading');
            console.log( "Finished" );
        });
    });
    $('#reset').on("click", function(){
        $('#messages').html("");
        $('.shoutbox-area').addClass("is-hidden");
        $('#postcode_lookup').removeClass('is-hidden');
        $('.results').addClass('is-hidden');
        $('#address').text("");
        $('#postcode').html("");
        $('.shoutbox-area').addClass("is-hidden");
    });
});



