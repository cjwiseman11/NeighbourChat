$(function(){
    var scriptLoaded = false;
    var pathname = window.location.pathname.replace("/","");
    if(pathname != ""){
        $('.pcinput').val(pathname);
        searchPostCode(pathname);
    } else if (!(localStorage.getItem("nayburResults") === null)) {
        var results = JSON.parse(localStorage.getItem('nayburResults'));
        var postcode = results.postcode;
        var string = results.string;
        lati = results.lati;
        lngi = results.lngi;
        setPostcode(postcode, string);
    }
    $('.postcode-area').removeClass("is-hidden");
    $('#lookup').on("click", function(){
        var postcode = $('.pcinput').val().toLowerCase().replace(/\s/g, '');
        $('#messages').html("");
        $('.chat-section').addClass("is-hidden");
        $(this).addClass('is-loading');
        searchPostCode(postcode);
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
        localStorage.removeItem('nayburResults');
    });

    function searchPostCode(postcode){
        $.getJSON("https://maps.googleapis.com/maps/api/geocode/json?address=" + postcode + "&key=AIzaSyA1T7ZFvQQlEDq1Tc6qhTBLy7ICAjrHUbw&components=country%3aGB", function(data) {
            console.log( "success" );
        })
        .done(function(data) {
            if(data.results.length > 0){
                var address_components = data.results[0].address_components;
                var components={}; 
                jQuery.each(address_components, function(k,v1) {jQuery.each(v1.types, function(k2, v2){components[v2]=v1.long_name});});
                if(components.postal_code){
                    postcode = components.postal_code;
                    var string = data.results[0].formatted_address.split(postcode,1)[0].replace(components.street_number + " ", "");
                    lati = data.results[0].geometry.location.lat;
                    lngi = data.results[0].geometry.location.lng;
                    localStorage.setItem('nayburResults', JSON.stringify({ 'lati': lati, 'lngi': lngi, 'postcode': postcode, 'string': string }));
                    setPostcode(postcode, string);
                    console.log( "Found" );
                } else {
                    lookupFail();
                    console.log("No Postcode");
                }
            } else {
                lookupFail();
                console.log("Not Found");
            }
        })
        .fail(function() {
            lookupFail();
            console.log( "Fail" );
        })
        .always(function() {
            $('#lookup').removeClass('is-loading');
            console.log( "Finished" );
        });
    }
    
    function getMessages(postcode){
        $('#messages').prepend('<div class="loading-msg message is-warning"><div class="message-body has-text-centered">Loading messages...</div></div>')
        $.get('/checkmessages?postcode=' + postcode, function(results) {
            $('.loading-msg').remove();
            if(results == "fail"){
                $('#messages').prepend('<div class="message is-danger"><div class="message-body has-text-centered">Messages failed to load for some reason. Please try again.</div></div>')
            } else if(results == "none") {
                $('#messages').prepend('<div class="message"><div class="message-body has-text-centered">Be first to shout here :)</div></div>')
            } else {
                for (var key in results) {
                    if (results.hasOwnProperty(key)) {
                        var val = results[key];
                        $('#messages').prepend($('<div class="message"><div class="message-body dont-break-out">' + val.message + '<div class="timestamp">' + val.timeposted + '</div></div></div>'));

                    }
                } 
            }
        });
    }
    
    function lookupFail(){
        $('#messages').text("Cannot find address. Please try again");
        $('.pcinput').addClass('is-danger');
        $('.help').removeClass('is-hidden');
    }

    function setPostcode(postcode, string){
        $('#postcode_lookup').addClass('is-hidden');
        $('.results').removeClass('is-hidden');
        $('.no-postcode > p > em').addClass("is-hidden");
        $('#address').text("Shouting to " + string);
        $('#postcode').html("<strong>" + postcode.toUpperCase() + "</strong>");
        $('.chat-section').removeClass("is-hidden");
        if(!scriptLoaded){
            $.getScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyA1T7ZFvQQlEDq1Tc6qhTBLy7ICAjrHUbw&callback=initMap");
            scriptLoaded = true;
        } else {
            initMap();
        }
        getMessages(postcode);
    }
});



