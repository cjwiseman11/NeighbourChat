$(function(){
    $('#lookup').on("click", function(){
        $.getJSON("https://api.getaddress.io/v2/uk/" + $('.pcinput').val() + "?api-key=lq-IdUHPgkqRr__lrbjvjA8429", function(data){
            var string = data.Addresses[0];
            var nonum = string.replace(/\d+/g, '');
            var nocomma = nonum.replace(/ ,/g , "");
            $('#address').text(nocomma);
        });
    });
});
