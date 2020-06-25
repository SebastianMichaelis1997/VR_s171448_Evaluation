/*
 *a closure to organize a bar that contains colors
 *the color items are created usind rounded divs (not svg-circles)
 *settings contain
 *parent : a jQuery-Div
 *colors: a list of colors
 *width: css property
 **/
function createColorbar(settings) {
    var mFlexContainer;
    var mContainer;

    var mEntries = [];//dict from color-codes to entries
    var mSelected;

    inflate();
    setupCSS();

    function inflate() {
        mContainer = $("<div/>").attr("id", "colorbar-container");
        settings.parent.append(mContainer);

        mFlexContainer = $("<div/>").attr("id", "colorbar-flexcontainer");
        mContainer.append(mFlexContainer);

        $.each(settings.colors, function (index, color) {
            createEntry(color);
        });
        selectEntry(settings.colors[0]);//select the first color
    }

    function setupCSS() {
        mContainer.css("display", "inline-block");//so that the ok button is placed right of the color bar
        mContainer.css("width", settings.width);//do not set width let the elements determine the width
        mContainer.css("overflow", "hidden");//let more color items disappear
        mFlexContainer.css("display", "flex");

    }

    function createEntry(aColor) {
        console.log("create entry for " + aColor);
        var entry = $("<div/>");
        entry.css("width", "20%");
        entry.css("margin-left", "2px");
        entry.css("max-width", "2em");

        //entry.css("height","10%");
        //entry.css("border-radius","5%");


        //entry.css("margin-left","0.5em");
        //entry.css("width","2.5em");
        //entry.css("height","2.5em");
        //entry.css("border-radius","1.25em");

        //entry.css("background-color",aColor);

        var inside = $("<div/>");
        inside.css("width", "100%");
        inside.css("border-radius", "50%");
        inside.css("padding-bottom", "100%");//padding is computed from the width -> a square can be created even without knowing the parent-height

        //inside.css("width","2.5em");
        //inside.css("height","2.5em");

        inside.css("background-color", aColor);
        inside.on("click touchstart", function () {
            onClick(aColor);
        });
        inside.hover(function () {
            onHoverIn(inside);
        }, function () {
            onHoverOut(inside);
        });
        inside.css("cursor", "pointer");
        entry.append(inside);

        mEntries[aColor] = entry;

        //entry.css("background-color","gray");
        mFlexContainer.append(entry);
    }

    function onClick(aColor) {
        console.log("clicked on " + aColor);
        unselectAll();
        selectEntry(aColor);
    }

    function selectEntry(aColor) {
        var entry = mEntries[aColor];
        if (entry != undefined) {
            entry.css("border", "solid 1px #a6a7a9");
        }
        mSelected = aColor;
    }

    function unselectAll() {
        for (var color in mEntries) {
            var entry = mEntries[color];
            entry.css("border", "");
        }
    }

    function onHoverIn(aEntry) {
        //aEntry.css("border","solid 1px black");
        aEntry.css("opacity", "0.8");
    }

    function onHoverOut(aEntry) {
        //aEntry.css("border","");
        aEntry.css("opacity", "1.0");
    }

    function getValue() {
        return mSelected;
    }

    return {
        "getValue": getValue
    };
}