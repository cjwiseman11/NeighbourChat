$('.tabs').on('click', 'a', function(){
    $('.cscolumn').addClass('is-hidden');
    $('.tabs li.is-active').removeClass('is-active');
    $(this).parent().addClass('is-active');
    if($(this).attr("data-tab") == "thread-tab"){
        $('.threadselected-column').removeClass('is-hidden');
    } else {
        $('.' + $(this).text().toLowerCase() + '-column').removeClass('is-hidden');
    }
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
                $('[data-tab]').parent().html("<a data-tab='thread-tab' class='" + data[0].id + "'>" + data[0].title + "</a>");
            } else {
                $('.tabs > ul').append("<li class='unique-thread-tab'><a data-tab='thread-tab' class='" + data[0].id + "'>" + data[0].title + "</a></li>");
            }
            $('.' + data[0].id).click();
        })
        .done(function(data) {
            if(data.length > 0){
                window.history.pushState({val1: data[0].postcode, val2: data[0].id}, "Thread", "?postcode=" + data[0].postcode + "&thread=" + data[0].id);
                $('.threadselected-column').attr('data-threadid', data[0].id);
                $('.threadselected-column').html('<div class="level">'+
                                                    '<div class="level-item level-left"><strong>' + data[0].title + '</strong></div>'+
                                                    '<div class="timeposted level-item level-left">' + data[0].timeposted + '</div>'+
                                                    '<div class="level-item level-left"><img src="http://maps.google.com/mapfiles/ms/icons/' + data[0].markercolour.toLowerCase() +'-dot.png"></div>'+
                                                '</div>'+
                                                '<hr>'+
                                                '<article class="media">'+
                                                    '<figure class="media-left">'+
                                                        '<p class="image is-64x64">'+
                                                        '<img src="">'+
                                                        '</p>'+
                                                    '</figure>'+
                                                    '<div class="media-content thread-article">'+
                                                        '<div class="content">'+
                                                        '<p><strong>Original Post</strong><br><br>'+
                                                             data[0].message +
                                                        '</p>'+
                                                    '</div>'+
                                                '</article>'+
                                                '<article class="media threadmessage-submit">'+
                                                    '<form id="send-thread-message-form" action="/sendthreadmessage" method="post" class="column">'+
                                                        '<div class="field">'+
                                                        '<input name="threadid" class="is-hidden" type="text" value="' + data[0].id + '">'+
                                                        '</div>'+
                                                        '<div class="media-content">'+
                                                            '<div class="field">'+
                                                            '<p class="control"><textarea name="message" class="textarea" placeholder="Add a comment..."></textarea></p>'+
                                                            '</div>'+
                                                            '<div class="field">'+
                                                            '<p class="control post-thread-comment"><button class="button">Post comment</button></p>'+
                                                            '</div>'+
                                                        '</div>'+
                                                    '</form>'+
                                                '</article>');
                $.getJSON("/getthreadmessages?threadid=" + data[0].id, function(data2) {
                    if(data2.length > 0 ){
                        for (var key in data2) {
                            if (data2.hasOwnProperty(key)) {
                                var val = data2[key];
                                $('.thread-article').append('<article class="media">'+
                                                                '<figure class="media-left">'+
                                                                    '<p class="image is-48x48">'+
                                                                    '<img src="">'+
                                                                    '</p>'+
                                                                '</figure>'+
                                                                '<div class="media-content">'+
                                                                    '<div class="content">'+
                                                                    '<p>'+
                                                                        '<strong>Reply ' + key + '</strong>'+
                                                                        '<br>'+
                                                                        '<div class="threadmessage">' + val.message + '</div>'+                                                                                
                                                                    '</p>'+
                                                                '</div>'+
                                                            '</article>');
                            }
                        } 
                    }
                }) 
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