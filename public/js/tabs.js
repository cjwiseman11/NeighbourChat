$('.tabs a').each(function(){
    $(this).on("click",function(){
        $('.' + $('.tabs li.is-active > a').text().toLowerCase() + '-column').addClass('is-hidden');
        $('.tabs li.is-active').removeClass('is-active');
        $(this).parent().addClass('is-active');
        $('.' + $(this).text().toLowerCase() + '-column').removeClass('is-hidden');
    });
});