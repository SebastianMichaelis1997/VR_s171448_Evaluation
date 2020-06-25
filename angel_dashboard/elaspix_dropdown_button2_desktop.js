/* closure to wrap a desktop dropdown menu that uses html-option with appended ok-button
 *
 * settings contain
 * parent: jQuery Div
 * id: id of the dropdown-group
 * labelText: 
 * titleText: the button's default value
 * listValues: a list of Values that are used as drop down values
 * width: css property
 * onChange: event listener that is called if something changes
 *
 * */
function createDropdowndesktop(settings) {

    var mContainer;
    var mMenu;
    var mOkButton;
    var mLastValue = "";
    var mLabel;

    inflate();
    setupCSS();

    function inflate() {
        mContainer = $("<div/>");
        mContainer.css("width", settings.width).css("padding", "10px");


        var inputGroup = $("<div/>").addClass("input-group");


        mLabel = $("<label/>").text(settings.labelText).addClass("design-farat");
        mMenu = $("<select/>").addClass("custom-select").addClass("design-farat");
        mMenu.css("cursor", "pointer").css("user-select", "none");


        var divAppend = $("<div/>").addClass("input-group-append");
        mOkButton = $("<button/>").addClass("btn btn-outline-secondary").attr("type", "button").text("OK").on("click ontouchstart", onClick);
        divAppend.append(mOkButton);


        mContainer.append(mLabel);
        mContainer.append(inputGroup);
        inputGroup.append(mMenu);
        inputGroup.append(divAppend);
        settings.parent.append(mContainer);
        setValues(settings.listValues);
    }

    function onClick() {
        if (settings.onChange != undefined) {
            settings.onChange(mMenu.val());
        }
    }

    function setValues(aValues) {

        mMenu.empty();
        $.each(aValues, function (index, value) {
            console.log("value=" + value);
            var entry = $("<option/>").text(value);
            //entry.on("click",function(){onValueSelect(value);});

            //entry.css("word-wrap","break-word");
            //entry.css("overflow","hidden");
            mMenu.append(entry);
        });
    }

    function onValueSelect(aValue) {
        console.log("onValueSelect with Value " + aValue);
        //mOkButton.text(aValue);


        if (settings.onChange != undefined) {
            mLastValue = aValue;//only fire if the value is new
            settings.onChange(aValue);
        }
    }

    function setupCSS() {
        mOkButton.css("background-color", "#20B1B4");
        mOkButton.css("color", "white");
        mOkButton.css("font-weight", "600");
        mOkButton.css("font-size", "24px");
        mLabel.css("font-weight", "600");
    }

    function getValue() {
        //return mOkButton.text();
    }

    return {
        "setValues": setValues,
        "getValue": getValue,
    };


}