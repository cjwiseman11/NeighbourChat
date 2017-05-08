$(function(){
    var scriptLoaded = false;
    $('#lookup').on("click", function(){
        $('#messages').html("");
        $('.chat-section').addClass("is-hidden");
        $(this).addClass('is-loading');
        var postcode = $('.pcinput').val().toLowerCase().replace(/\s/g, '');
        $.getJSON("https://maps.googleapis.com/maps/api/geocode/json?address=" + postcode + "&key=AIzaSyA1T7ZFvQQlEDq1Tc6qhTBLy7ICAjrHUbw", function(data) {
            console.log( "success" );
        })
        .done(function(data) {
            $('#postcode_lookup').addClass('is-hidden');
            $('.results').removeClass('is-hidden');
            $('.no-postcode > p > em').addClass("is-hidden");
            lati = data.results[0].geometry.location.lat;
            lngi = data.results[0].geometry.location.lng;
            var string = data.results[0].formatted_address;
            $('#address').text("Shouting to " + string);
            $('#postcode').html("<strong>" + postcode.toUpperCase() + "</strong>");
            $('.chat-section').removeClass("is-hidden");
            if(!scriptLoaded){
                $.getScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyA1T7ZFvQQlEDq1Tc6qhTBLy7ICAjrHUbw&callback=initMap");
                scriptLoaded = true;
            } else {
                initMap();
            }
            $.get('/checkmessages?postcode=' + postcode, function(results) {
                for (var key in results) {
                    if (results.hasOwnProperty(key)) {
                        var val = results[key];
                        $('#messages').prepend($('<div class="message"><div class="message-body dont-break-out">' + val.message + '<div class="timestamp">' + val.timeposted + '</div></div></div>'));

                    }
                }
            });
            console.log( "Found" );
        })
        .fail(function() {
            $('#messages').text("Cannot find address. Please try again");
            $('.pcinput').addClass('is-danger');
            $('.help').removeClass('is-hidden');
            console.log( "Fail" );
        })
        .always(function() {
            $('#lookup').removeClass('is-loading');
            console.log( "Finished" );
        });
    });
    $('#reset').on("click", function(){
        $('#messages').html("");
        $('.chat-section').addClass("is-hidden");
        $('#postcode_lookup').removeClass('is-hidden');
        $('.results').addClass('is-hidden');
        $('#address').text("");
        $('#postcode').html("");
        $('.no-postcode > p > em').removeClass("is-hidden");
        $('.pcinput').removeClass('is-danger');
        $('.help').addClass('is-hidden');
    });
});



