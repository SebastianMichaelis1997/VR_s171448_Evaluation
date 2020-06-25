/*
 *
 *closure to hold to color selectors *
 *with settings
 *	parent: the parent Div
 *	top: css top property
 *	left: css left property
 *	color1:	css-default color at start 
 *	color2:	css-default color at start
 *	onChange: eventMethod to be called if the color has changed
 **/

function createColorpicker(settings) {
    var mContainerItems;
    var mColorButtonContainer;
    var mColorButton1;
    var mColorButton2;
    var mItemsDivButton1;//holds the picker items
    var mItemsDivButton2;//holds the picker items
    var mColor1 = settings.color1;
    var mColor2 = settings.color2;

    var mColors;//list of provided colors
    var mColorButtonSet;//number of the pressed button


    inflate();
    setup();
    setupCSS();

    function inflate() {

        mColorButtonContainer = $("<div/>").attr("id", "colorpicker-buttoncontainer");
        settings.parent.append(mColorButtonContainer);//to be layouted & positioned with controlbar-desktop

        mContainerItems = $("<div/>").attr("id", "colorpicker-items");
        settings.parent.append(mContainerItems);


        //mColorButton1=$("<div/>").addClass("colorpicker-button");
        mColorButton1 = createCircleSVG("red", "colorpicker-bgColor");
        mColorButtonContainer.append(mColorButton1.wrapper);
        //mColorButton2=$("<div/>").addClass("colorpicker-button");
        mColorButton2 = createCircleSVG("green", "colorpicker-folienColor");
        mColorButtonContainer.append(mColorButton2.wrapper);
        mItemsDivButton1 = $("<div/>").attr("id", "colorItemsButton1");
        mContainerItems.append(mItemsDivButton1);
        mItemsDivButton2 = $("<div/>").attr("id", "colorItemsButton2");
        mContainerItems.append(mItemsDivButton2);


    }


    function setup() {

        mColors = ["#f1ef27", "#28303D", "#2ecc71", "#3498db", "#9b59b6", "#34495e", "#16a085", "#27ae60", "#2980b9", "#8e44ad", "#2c3e50",
            "#f1c40f", "#e67e22", "#e74c3c", "#ecf0f1", "#95a5a6", "#f39c12", "#d35400", "#c0392b", "#bdc3c7", "#7f8c8d"];

        //Crayola Colors mady by Jenny's Crayon Collection
        mColors2 = ["#f1ef27", "#28303D", "#487343", "#435497", "#643f2a", "#464fae", "#6367b6", "#8b479b", "#b6639d", "#50705f", "#8ebcc3",
            "#afaca2", "#8c8793", "#c368a9", "#cd6683", "#8b9e5f", "#8b9fb1", "#c0b8cd", "#ac4d5c", "#889635", "#d8b9c3", "#ccbaa8"];


        $.each(mColors, function (index, color) {
            var item = createCircleSVG(color);
            setCSSColorItem(item.wrapper, color);
            mItemsDivButton1.append(item.wrapper);
        });

        $.each(mColors2, function (index, color) {
            var item = createCircleSVG(color);
            setCSSColorItem(item.wrapper, color);
            mItemsDivButton2.append(item.wrapper);
        });

        mColorButton1.wrapper.on("click touchstart", onClickColorButton1);
        mColorButton1.wrapper.hover(function () {
            onHoverIn(mColorButton1.wrapper);
        }, function () {
            onHoverOut(mColorButton1.wrapper);
        });
        mColorButton2.wrapper.on("click touchstart", onClickColorButton2);
        mColorButton2.wrapper.hover(function () {
            onHoverIn(mColorButton2.wrapper);
        }, function () {
            onHoverOut(mColorButton2.wrapper);
        });

        //mTooltip=createTooltip({"parent":mContainerItems});
        //mTooltip.registerButton(mColorButton1,"Farbe der Fahrzeugfolie");
        //mTooltip.registerButton(mColorButton2,"Farbe der Fensterfolie");

    }

    function setupCSS() {
        mContainerItems.css("width", "100%");
        mContainerItems.css("height", "100%");
        mContainerItems.css("position", "absolute");
        mContainerItems.css("top", "10%");
        mContainerItems.css("left", settings.left);
        mContainerItems.css("margin", "1%");
        mContainerItems.css("z-index", "12");


        mColorButtonContainer.css("width", "10%").css("height", "17.7%");
        mColorButtonContainer.css("display", "flex");
        mColorButtonContainer.css("z-index", "12");
        mColorButtonContainer.css("position", "absolute");
        mColorButtonContainer.css("top", settings.top);
        mColorButtonContainer.css("left", settings.left);
        //mColorButtonContainer.css("margin","1%");


        setCSSColorButton(mColorButton1.wrapper);
        //setBorderButton(mColorButton1);
        setCSSColorButton(mColorButton2.wrapper);
        //setBorderButton(mColorButton2);
        mColorButton1.circle = $("#colorpicker-bgColor");//for some strange reason is access to circle direclty using fields in createSVGCircle not working (fill-color cannot be changed)
        mColorButton1.circle.css("fill", mColor1);
        mColorButton2.circle = $("#colorpicker-folienColor");//for some strange reason is access to circle direclty using fields in createSVGCircle not working (fill-color cannot be changed)
        mColorButton2.circle.css("fill", mColor2);
        mItemsDivButton1.css("display", "none");
        mItemsDivButton2.css("display", "none");
    }

    function onHoverIn(aButton) {
        aButton.css("opacity", "0.5");
        //mTooltip.show(aButton);
    }

    function onHoverOut(aButton) {
        aButton.css("opacity", "1");
        //mTooltip.hide();
    }


    //aId may be undefined
    function createCircleSVG(aColor, aId) {
        var wrapper = $("<span/>").addClass("wrapper");
        var svg = $("<svg/>").attr("viewBox", "0 0 10.583333 10.583334").attr("width", "100%");
        var circle = $("<circle/>").attr("r", "4.911").attr("cx", "5.29").attr("cy", "5.29");
        if (aId != undefined) {
            circle.attr("id", aId);
        }
        circle.css("fill", aColor);
        svg.append(circle);
        var svgAsString = svg.get(0).outerHTML;
        wrapper.html(svgAsString);
        return {"wrapper": wrapper, "circle": circle};
    }


    function onClickColorButton1() {
        if (mColorButtonSet != 1) {
            mItemsDivButton2.hide();//in case it is open
            mItemsDivButton1.show("slow");
            mColorButtonSet = 1;
        } else {
            //mItemsDivButton2.hide();//in case it is open
            mItemsDivButton1.hide();
            mColorButtonSet = undefined;
        }
    }

    function onClickColorButton2() {

        if (mColorButtonSet != 2) {
            mItemsDivButton1.hide();//in case it is open
            mItemsDivButton2.show("slow");
            mColorButtonSet = 2;
        } else {
            //mItemsDivButton2.hide("slow");//in case it is open
            mItemsDivButton2.hide();
            mColorButtonSet = undefined;
        }
    }

    function onClickColorItem(aColor) {
        if (mColorButtonSet != undefined) {
            switch (mColorButtonSet) {
                case 1:
                    if (mColor1 != aColor) {
                        mColorButton1.circle.css("fill", aColor);
                        $("#bgColor").css("fill", aColor);
                        mColor1 = aColor;
                        settings.onChange();
                    }
                    mItemsDivButton1.hide("fast");
                    break;

                case 2:
                    if (mColor2 != aColor) {
                        mColorButton2.circle.css("fill", aColor);
                        mColor2 = aColor;
                        settings.onChange();
                    }
                    mItemsDivButton2.hide("fast");
                    break;
            }
            mColorButtonSet = undefined;
        }
    }

    function setCSSColorButton(aButton) {
        aButton.css("width", "40%").css("height", "40%");//4vw
        //aButton.css("display","inline-block");
        aButton.css("margin", "2%");
        aButton.css("border-radius", "3vw");
        aButton.css("cursor", "pointer");
    }

    function setCSSColorItem(aItem, aColor) {
        //aItem.css("margin","0.5vw");
        aItem.css("margin", "1%");
        //aItem.css("width","10vw");
        aItem.css("width", "10%");
        aItem.css("display", "inline-block");
        aItem.css("cursor", "pointer");
        aItem.on("click touchstart", function () {
            onClickColorItem(aColor);
        });
    }

    function setBorderButton(aButton) {
        aButton.css("border", "solid 2px rgba(241,239,39,0.5)");
    }

    function hide() {
        mContainerItems.css("display", "none");
    }

    function show() {
        mContainerItems.css("display", "block");
    }

    function getConfig() {
        return {"bgColor": mColor1.substr(1), "windowColor": mColor2.substr(1)};//remove the "#" from color value
    }

    //used when a config is restored
    function setColors(aColor1, aColor2) {
        mColor1 = "#" + aColor1;
        mColorButton1.circle.css("fill", mColor1);
        mColor2 = "#" + aColor2;
        mColorButton2.circle.css("fill", mColor2);

    }

    function getColorButton1() {
        return mColorButton1;
    }


    return {
        "hide": hide,
        "show": show,
        "getConfig": getConfig,
        "setColors": setColors,
        "getColorButton1": getColorButton1
    };
}