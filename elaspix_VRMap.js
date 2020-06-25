/**
 *closure to handle a map with pins
 *settings requires
 *    parent: the jQuery-Div
 *    isDraggable: if true, pins can be dragged & dropped to define new target positions
 *    onMove: a pin has moved significantly
 **/
function createVRMap(settings) {

    var mImgMapWrap;//has map as background and contains mPinsDiv
    var mPinsDiv;//scaled to the fill size in px of background map
    var mPins = [];//dict that maps a name to its pin-Object
    var mShiftMap = {"x_px": 0, "y_px": 0};//do not delete or ={} or =null this dict as it is refered from the pins

    inflate();
    setupCSS();
    shiftMap(0, 0);
    update();//intervall function to move all pins

    var mMouseSlide = {"x_down_px": 0, "y_down_px": 0, "isDown": false, "x_shift_px": 0, "y_shift_px": 0};

    function inflate() {
        mImgMapWrap = $("<div/>").attr("id", "vrmap-imgwrap");


        mPinsDiv = $("<div/>").attr("id", "vrmap-pinsdiv");


        settings.parent.append(mImgMapWrap);
        mImgMapWrap.append(mPinsDiv);
    }

    function setupCSS() {

        mImgMapWrap.css("width", "100%");
        mImgMapWrap.css("padding-bottom", "60%");
        mImgMapWrap.css("margin", "2%");
        //mImgMapWrap.css("background-color","red");

        mImgMapWrap.css("background-image", "url('pics/map_pebbleBeach.jpg'");
        mImgMapWrap.css("background-position", "0px 0px");
        mImgMapWrap.css("background-repeat", "no-repeat");
        mImgMapWrap.css("overflow", "hidden");//do not show pins laying outside of div
        mImgMapWrap.css("transition", "background-position 1s");
        mImgMapWrap.css("position", "relative");//otherwise overflow hidden is not working for south border
        mImgMapWrap.css("cursor", "grab");

        mImgMapWrap.css("border", "2px solid #BCBCBC");

        mPinsDiv.css("position", "absolute");
        mPinsDiv.css("top", "0");
        mPinsDiv.css("left", "0");
        mPinsDiv.css("width", "1547px");

        mPinsDiv.css("height", "1238px");
        mPinsDiv.css("user-select", "none");
        mPinsDiv.css("overflow", "hidden");//do not show pins laying outside of div
        if (settings.isDraggable == true) {
            mPinsDiv.on("dragover", onDragOver);//use preventDefault to allow a drop (per default the drop is not allowed on divs)
            mPinsDiv.on("drop", onDrop);//called when the drop happened
        }

        mShiftMap.wrapper_width_current_px = mImgMapWrap.width();//whenever a resize occurs update the current width to reposition
        mImgMapWrap.on("mousedown", onMouseDown);
        mImgMapWrap.on("mouseup", onMouseUp);
        mImgMapWrap.on("mousemove", onMouseMove);

    }

    //called when a pin-container was dropped
    //notifies the pin that it was dropped to use the drop-coordinates as target
    function onDrop(event) {
        event.preventDefault();
        var idDropped = event.originalEvent.dataTransfer.getData("text");
        console.log("a drop happed of id " + idDropped);
        console.log(event.clientX);
        var namePin = idDropped.substr(4);//remove "pin-" prefix
        var pin = mPins[namePin];
        if (pin != undefined) {
            pin.onDrop(event.clientX, event.clientY);
        } else {
            console.log("dropped pin not found :" + namePin);
        }
    }

    function onDragOver(event) {
        event.preventDefault();//the default would be not to allow the drop but we want to allow it here as pin-container shall be dropped
    }

    function onMouseMove(event) {
        if (mMouseSlide.isDown) {
            var dx = event.clientX - mMouseSlide.x_down_px;
            var dy = event.clientY - mMouseSlide.y_down_px;
            //console.log("dx="+dx+" dy="+dy);
            shiftMap(dx + mMouseSlide.x_shift_px, dy + mMouseSlide.y_shift_px);
        }
    }

    function onMouseDown(event) {
        setSmoothTransition(false);
        mMouseSlide.x_down_px = event.clientX;
        mMouseSlide.y_down_px = event.clientY;
        mMouseSlide.x_shift_px = mShiftMap.x_px;
        mMouseSlide.y_shift_px = mShiftMap.y_px;
        mMouseSlide.isDown = true;
        mImgMapWrap.css("cursor", "grabbing");
        //console.log(mMouseSlide);
    }

    function onMouseUp() {
        mMouseSlide.isDown = false;
        setSmoothTransition(true);
        mImgMapWrap.css("cursor", "grab");
    }

    function addPin(aName, aPosition) {
        //console.log("addPin for "+aName+" at ["+aX+","+aY+"]");

        if (mPins.hasOwnProperty(aName) == false) {
            var pin = createPin({
                "parent": mPinsDiv, "name": aName, "pos": aPosition,
                "onMove": onSignificantMove, "onClick": onPinClicked,
                "shiftMap": mShiftMap, "isDraggable": settings.isDraggable
            });
            mPins[aName] = pin;
        } else {
            console.log("a pin with that name is already registered: " + aName);
        }
    }

    function empty() {
        mPins = {};
        mPinsDiv.empty();
    }

    function setTarget(aName, aX, aY) {

        var pin = mPins[aName];
        if (pin != undefined) {
            pin.setTarget(aX, aY);
        }
    }

    //called by each pin to declare a significant change of position
    function onSignificantMove(aName, aX, aY) {
        //console.log("sig move to "+aX+","+aY);
        if (settings.onMove != undefined) {
            settings.onMove(aName, aX, aY);
        }

    }

    function onPinClicked(aName) {
        console.log("a pins was clicked with name " + aName);
    }

    //regularely called function to update all movements
    function update() {
        move();
        setTimeout(update, 500);
    }

    function move() {
        for (var pinName in mPins) {
            var pin = mPins[pinName];
            pin.move();
        }
    }

    //shifts the map of x,y Pixel
    function shiftMap(aXPixel, aYPixel) {
        mShiftMap.x_px = aXPixel;
        mShiftMap.y_px = aYPixel;

        mImgMapWrap.css("background-position", mShiftMap.x_px + "px " + mShiftMap.y_px + "px");

        for (var pinName in mPins) {
            var pin = mPins[pinName];
            pin.updatePos();//update the position considering new values of mShiftMap
        }
    }

    //center the pin of aPinName on the map
    function centerMap(aPinName) {
        var pin = mPins[aPinName];
        if (pin != undefined) {
            var posPin = pin.getPos();
            var widthWrapper_px = mImgMapWrap.width();
            var heightWrapper_px = widthWrapper_px * 0.8;//CSS rule padding-bottom has defined it to 80% of width
            console.log("mImagWrap.width()=" + widthWrapper_px);
            console.log("mImagWrap.height()=" + heightWrapper_px);
            shiftMap(widthWrapper_px / 2 - posPin.x, heightWrapper_px / 2 - posPin.y);

        }
    }

    function setSmoothTransition(aIsSmoothTransition) {
        if (aIsSmoothTransition) {
            mImgMapWrap.css("transition", "background-position 1s");
        } else {
            mImgMapWrap.css("transition", "");
        }

        for (var pinName in mPins) {
            var pin = mPins[pinName];
            pin.setSmoothTransition(aIsSmoothTransition);
        }
    }

    function hide() {
        mImgMapWrap.css("display", "none");
    }

    function fadeOut(aFunction) {
        mImgMapWrap.fadeOut("slow", function () {
            mImgMapWrap.hide("slow");
            if (aFunction != undefined) {
                aFunction();
            }
        });
    }

    function show() {
        mImgMapWrap.show("slow");
    }

    function getPins() {
        return mPins;
    }


    return {
        "hide": hide,
        "fadeOut": fadeOut,
        "show": show,
        "addPin": addPin,
        "setTarget": setTarget,
        "move": move,
        "shiftMap": shiftMap,
        "centerMap": centerMap,
        "getPins": getPins,
        "empty": empty
    };
}