var needFirstPoint = true;

function drawNextLine(ctx, x, y) {
    if (needFirstPoint) {
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(x, y);
        needFirstPoint = false;
    }
    else {
        ctx.lineTo(x, y);
        ctx.stroke();
    }
}

$(document).ready(function(){
    var canvas = $('#map_Canvas').get(0);
    if (!canvas.getContext) { return; }
    var ctx = canvas.getContext('2d');

    $('#map_Canvas').on('click', function(e){
        var offset = $(this).offset();
        var x = e.pageX - offset.left;
        var y = e.pageY - offset.top;
        drawNextLine(ctx, x, y);
    });
});
