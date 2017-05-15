/*$('.tabs a').each(function(){
    $(this).bind("click",function(){
        $('.' + $('.tabs li.is-active > a').text().toLowerCase() + '-column').addClass('is-hidden');
        $('.tabs li.is-active').removeClass('is-active');
        $(this).parent().addClass('is-active');
        $('.' + $(this).text().toLowerCase() + '-column').removeClass('is-hidden');
    });
});*/

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
                $('[data-tab]').parent().html("<li><a data-tab='thread-tab' class='" + data[0].id + "'>" + data[0].title + "</a></li>");
            } else {
                $('.tabs > ul').append("<li><a data-tab='thread-tab' class='" + data[0].id + "'>" + data[0].title + "</a></li>");
            }
            $('.' + data[0].id).click();
        })
        .done(function(data) {
            if(data.length > 0){
                $('.threadselected-column').html('<div class="content"><h3>' + data[0].title + '</h3></div>'+
                                                    '<div class="threadmessage"><p>' + data[0].message + '</p><div>'+
                                                    '<div class="timeposted">' + data[0].timeposted + '</div>'+
                                                '</div>');
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