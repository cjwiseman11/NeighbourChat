$('.tabs').on('click', 'a', function(){
    $('.cscolumn').addClass('is-hidden');
    $('.tabs li.is-active').removeClass('is-active');
    $(this).parent().addClass('is-active');
    if($(this).attr("data-tab") == "thread-tab"){
        $('.threadselected-column').removeClass('is-hidden');
    } else {
        $('.' + $(this).text().toLowerCase() + '-column').removeClass('is-hidden');
    }
    google.maps.event.trigger(map, 'resize');
});

$('.create-thread').on("click", function(){
    $('.thread-creator').toggleClass('is-hidden');
    $(this).text(($(this).text() === 'Create Thread') ? 'Cancel' : 'Create Thread');
});

$('#threads').on("click", '.thread-link', function(){
        $('.threads-column').addClass('is-hidden');
        $('.threadselected-column').removeClass('is-hidden');
        $('.threadselected-column').html('Loading this thread...');
        $.getJSON("/getthreadbyid?id=" + $(this).attr("id"), function(data) {
            console.log( "thread success" );
            if($('[data-tab]').length > 0){
                $('[data-tab]').parent().html("<li><a data-tab='thread-tab' class='" + data[0].id + "'>" + data[0].title + "</a></li>");
            } else {
                $('.tabs > ul').append("<li><a data-tab='thread-tab' class='" + data[0].id + "'>" + data[0].title + "</a></li>");
            }
            $('.' + data[0].id).click();
        })
        .done(function(data) {
            if(data.length > 0){
                $('.threadselected-column').html('<div class="level">'+
                                                    '<div class="level-item level-left"><strong>' + data[0].title + '</strong></div>'+
                                                    '<div class="timeposted level-item level-left">' + data[0].timeposted + '</div>'+
                                                    '<div class="level-item level-left"><img src="http://maps.google.com/mapfiles/ms/icons/' + data[0].markercolour.toLowerCase() +'-dot.png"></div>'+
                                                '</div>'+
                                                '<article class="media">'+
                                                    '<div class="media-content">'+
                                                        '<div class="content">'+
                                                        '<p>'+
                                                             data[0].message +
                                                        '</p>'+
                                                    '</div>'+
                                                '</article>'+
                                                '<article class="media">'+
                                                    '<div class="media-content">'+
                                                        '<div class="field">'+
                                                        '<p class="control"><textarea class="textarea" placeholder="Add a comment..."></textarea></p>'+
                                                        '</div>'+
                                                        '<div class="field">'+
                                                        '<p class="control"><button class="button">Post comment</button></p>'+
                                                        '</div>'+
                                                    '</div>'+
                                                '</article>');
            } else {
                console.log("Thread Not Found");
            }
        })
        .fail(function() {
            console.log( "Thread Fail" );
        })
        .always(function() {
            console.log( "Thread Finished" );
        });
    
});