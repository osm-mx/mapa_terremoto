$(function(){
    $('[data-toggle=confirmation]').confirmation({
        rootSelector: '[data-toggle=confirmation]'
    });
    
    
    $("#submitPointData").click(function(e){
        window.savePoint();
    });
    
});