$(function(){
    $('[data-toggle=confirmation]').confirmation({
        rootSelector: '[data-toggle=confirmation]'
    });
    
    // prevent submit 
    $("#search").keydown(function(event){
        if(event.keyCode == 13) {
          event.preventDefault();
          return false;
        }
    });
    
    // movil
    $("#search").keyup(function(event){
        if(""==event.target.value){
            $(".form-map").removeClass("active");
        }
    });
});