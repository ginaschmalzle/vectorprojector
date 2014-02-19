;function buttonClick(subEvent)
{
    var mainEvent = subEvent ? subEvent : window.event;

    alert("This button click occurred at: X(" +
    mainEvent.screenX + ") and Y(" + mainEvent.screenY + ")");
}
