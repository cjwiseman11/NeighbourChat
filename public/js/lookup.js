var map;
var usermarker;
var scriptLoaded = false;
function initMap() {
    var marker = {lat: lati, lng: lngi};
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 17,
        center: marker,
        scrollwheel: false,
        navigationControl: false,
        mapTypeControl: false,
        draggable: false,
        zoomControl: false,
        disableDoubleClickZoom: true
    });
    google.maps.event.addListener(map, 'click', function(event) {
        placeMarker(event.latLng);
    });
}

function placeMarker(location) {
    if($('#marker-select').val() != 'None'){
        $('.marker-latitude').val(location.lat());
        $('.marker-longitude').val(location.lng());
        if(usermarker){
            usermarker.setMap(null);  
        }           
        usermarker = new google.maps.Marker({
            position: location, 
            map: map,
            icon: 'http://maps.google.com/mapfiles/ms/icons/' + $('#marker-select').val().toLowerCase() +'-dot.png'
        });
    }
}

    function searchPostCode(postcode){
        $('#messages').html("");
        $.getJSON("https://maps.googleapis.com/maps/api/geocode/json?address=" + postcode + "&key=AIzaSyA1T7ZFvQQlEDq1Tc6qhTBLy7ICAjrHUbw&components=country%3aGB", function(data) {
            console.log( "success" );
        })
        .done(function(data) {
            if(data.results.length > 0){
                var address_components = data.results[0].address_components;
                var components={}; 
                jQuery.each(address_components, function(k,v1) {jQuery.each(v1.types, function(k2, v2){components[v2]=v1.long_name});});
                if(components.postal_code){
                    $('.nayburhead').removeClass('hero-body').addClass('heropad');
                    postcode = components.postal_code;
                    var string = data.results[0].formatted_address.split(postcode,1)[0].replace(components.street_number + " ", "");
                    lati = data.results[0].geometry.location.lat;
                    lngi = data.results[0].geometry.location.lng;
                    localStorage.setItem('nayburResults', JSON.stringify({ 'lati': lati, 'lngi': lngi, 'postcode': postcode, 'string': string }));
                    setPostcode(postcode, string);
                    initMap();
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

    function getThreads(postcode){
        $('#threads').prepend('<div class="loading-msg message is-warning"><div class="message-body has-text-centered">Loading threads...</div></div>')
        $.get('/checkthreads?postcode=' + postcode, function(results) {
            $('.loading-msg').remove();
            if(results == "fail"){
                $('#threads').prepend('<div class="message is-danger"><div class="message-body has-text-centered">Threads failed to load for some reason. Please try again.</div></div>')
            } else if(results == "none") {
                $('#threads').prepend('<div class="message"><div class="message-body has-text-centered">Be first to create a thread here :)</div></div>')
            } else {
                var labelno = 0;
                var threadmarker = [];
                for (var key in results) {
                    if (results.hasOwnProperty(key)) {
                        labelno++;
                        var val = results[key];
                        $('#threads').prepend($('<div class="message content"><a class="thread-link" id="' + val.id + '"><div class="message-body"><div class="level is-mobile"><div class="level-left"><h3 class="dont-break-out level-item">' + val.title + '</h3></div><div class="level-right"><div class="marker-colour"><img src="http://maps.google.com/mapfiles/ms/icons/' + val.markercolour.toLowerCase() +'-dot.png"></div></div></div></div></a>'));
                        var markerloc = new google.maps.LatLng(val.markerlat, val.markerlng)
                        threadmarker = new google.maps.Marker({
                            id: val.id,
                            position: markerloc, 
                            map: map,
                            labelOrigin: new google.maps.Point(0, 0),
                            icon: 'http://maps.google.com/mapfiles/ms/icons/' + val.markercolour.toLowerCase() +'-dot.png',
                            title: val.title,
                            label: labelno.toString()
                        });
                        google.maps.event.addListener(threadmarker, 'click', function(){
                            selectThreadByID(this.id);
                        });
                        threadmarker.setMap(map);
                    }
                } 
            }
        });
    }

    function selectThreadByID(id){
        $('a.threadstablink').click();
        $('a#' + id).click();
    }
    
    function lookupFail(){
        $('#messages').text("Cannot find address. Please try again");
        $('.pcinput').addClass('is-danger');
        $('.help').removeClass('is-hidden');
    }

    function setPostcode(postcode, string){
        $('#postcode_lookup').addClass('is-hidden');
        $('.results').removeClass('is-hidden');
        $('.tabs').removeClass('is-hidden');
        $('.no-postcode > p > em').addClass("is-hidden");
        $('#address').text("Shouting to " + string);
        $('#postcode').html("<strong>" + postcode.toUpperCase() + "</strong>");
        $('.chat-section').removeClass("is-hidden");
        $('#threadpostcode').val(postcode);
        getMessages(postcode);
        getThreads(postcode);
    }
$(function(){
    var pathname = getParameterByName("postcode");
    if(pathname != null && pathname != ""){
        $('.pcinput').val(pathname);
        searchPostCode(pathname);
    }/* else if (!(localStorage.getItem("nayburResults") === null)) {
        var results = JSON.parse(localStorage.getItem('nayburResults'));
        var postcode = results.postcode;
        var string = results.string;
        lati = results.lati;
        lngi = results.lngi;
        setPostcode(postcode, string);
    }*/
    $('.postcode-area').removeClass("is-hidden");
    $('#lookup').on("click", function(){
        var postcode = $('.pcinput').val().toLowerCase().replace(/\s/g, '');
        window.history.pushState(postcode, postcode, '?postcode=' + postcode);
        $(this).addClass('is-loading');
        searchPostCode(postcode);
    });
    window.onpopstate = function(e){
        if(e.state == null || typeof e.state === 'object'){
            resetPage();
        } else if (typeof e.state === 'string'){
            searchPostCode(e.state);
        }
    };
    $('#reset').on("click", function(){
        resetPage();
        window.history.pushState("Home", "Home", "/");
    });

    function resetPage(){
        $('.unique-thread-tab').remove();
        $('.threadselected-column').addClass("is-hidden");
        $('.threadselected-column').html("");
        $('#messages').html("");
        $('#threads').html("");
        $('.chat-section').addClass("is-hidden");
        $('#postcode_lookup').removeClass('is-hidden');
        $('.results').addClass('is-hidden');
        $('#address').text("");
        $('#postcode').html("");
        $('.no-postcode > p > em').removeClass("is-hidden");
        $('.pcinput').removeClass('is-danger');
        $('.help').addClass('is-hidden');
        $('.tabs').addClass('is-hidden');
        $('.chat-column').removeClass('is-hidden');
        $('.threads-column').addClass('is-hidden');
        $('.tabs li.is-active').removeClass('is-active');
        $('.chattablink').parent().addClass('is-active');
        $('.nayburhead').removeClass('heropad').addClass('hero-body');
        localStorage.removeItem('nayburResults');
    }
});



