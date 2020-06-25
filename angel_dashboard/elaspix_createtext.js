/* closure for create text
 *
 * settings contains
 * parent: a jQuery Div
 * parentColumn1: parent Div column1
 * parentColumn2: parent Div column2
 * renderURLBase: the render base url to call a text renderer
 * getSession: a function to be used to get the current user session.email
 * addMotive: a function that adds the text-motive to the motive-bars (desktop and mobile)
 *
 * */
function createCreatetext(settings) {
    var mContainerFlex;
    var mContainer;
    var mTextInput;
    var mFontDropdown;
    var mColorbar;
    var mOKButton;
    var mBreakLine;
    var mOKButtonBreak;
    inflate();
    setupCSS();
    hide();

    function inflate() {
        mContainer = $("<div/>").attr("id", "createtext-container");
        mContainerFlex = $("<div/>");
        mContainer.append(mContainerFlex);
        settings.parentColumn2.append(mContainer);

        mTextInput = createInputtext({
            "parent": settings.parentColumn1, "id": "createtext-input", "width": "100%",
            "labelText": "Texteingabe", "inputPlaceholder": "Ihr Text", "inputType": "text",
            "hintText": "",
            "onKeypress": onKeypress
        });


        mFontDropdown = createDropdowndesktop({
            "parent": mContainerFlex, "id": "createtext-font", "labelText": "Schriftart",
            "titleText": "HELVETICA", "listValues":
                ["Helvetica", "Courier", "AvantGarde-demi", "Bookmann-light", "Times-Roman"],
            "width": "80%", "onChange": onFontDropdownChange
        });
        var colors = ["#f1ef27", "#28303D", "#2ecc71", "#3498db", "#9b59b6", "#34495e"];// "#16a085", "#27ae60"];//, "#2980b9", "#8e44ad" ];//, "#2c3e50"];
        //"#f1c40f", "#e67e22", "#e74c3c", "#ecf0f1", "#95a5a6", "#f39c12", "#d35400", "#c0392b", "#bdc3c7", "#7f8c8d"];


        mBreakLine = $("<div/>");
        mOKButtonBreak = $("<br/>");
        mBreakLine.append(mOKButtonBreak);

        mColorbar = createColorbar({"parent": mBreakLine, "colors": colors, "width": "60%"});
        mOKButton = $("<button/>").attr("type", "button").text("OK");
        mBreakLine.append(mOKButton);
        mContainerFlex.append(mBreakLine);
        mOKButton.on("click touchstart", onOKButton);

    }

    function setupCSS() {
        mContainerFlex.css("width", "100%").css("display", "flex");
        mBreakLine.addClass("form-group");
        mBreakLine.css("padding", "10px 0px 10px 0px");
        mBreakLine.css("width", "100%");

        mOKButtonBreak.css("line-height", "2em");//enforce line break
        mOKButton.addClass("btn btn-primary");
        mOKButton.css("margin-bottom", "2em");
        mOKButton.css("margin-left", "5px");


    }

    function onFontDropdownChange(aValue) {

    }

    function onKeypress() {
        //just reset the warning message in case of input
        mTextInput.setHintText("");
        mTextInput.setHintClass("");

    }

    function onOKButton() {
        var text = mTextInput.getValue();
        if (text == undefined || text.length <= 0) {
            fadeOut();
            //mTextInput.setHintText("Bitte geben Sie einen Text ein!");
            //mTextInput.setHintClass("text-danger");
        } else {
            mTextInput.setHintText("Das Textmotiv wird gerade erstellt...");
            mTextInput.setHintClass("text-warning");

            var font = mFontDropdown.getValue();
            var color = mColorbar.getValue().substr(1);//remove "#" sign

            var urlCreatetext = settings.renderURLBase + "/createtext?text=" + encodeURIComponent(text) + "&font=" + font + "&fontcolor=" + color;
            var fileNameSuffix = encodeURIComponent(text.trim().split(" ").join("_")) + ".png";//create a guessable and stable fileName from a given text
            var userFileName = settings.getSession().email + "/" + fileNameSuffix;
            urlCreatetext += "&s3uploadname=" + userFileName + "&bucket=bussestrains";
            console.log(urlCreatetext);
            $.getJSON(urlCreatetext, function (response) {
                console.log(response);
                if (response.upload == "ok") {
                    settings.addMotive(userFileName, false);// show text motive in motive bars
                    mTextInput.setHintText("Der Text wurden als Motiv hinzugefügt.");
                    mTextInput.setHintClass("text-success");
                    setTimeout(function () {//hides itself after 1sec
                        fadeOut();
                    }, 2000);
                }

            });
        }


    }

    function fadeOut() {
        mContainer.fadeOut("slow", function () {
            mContainer.hide("slow");
        });
        mTextInput.fadeOut();
    }

    function hide() {
        mContainer.css("display", "none");
        mTextInput.hide();
    }

    function show() {
        mTextInput.setHintText("");
        mTextInput.setHintClass("text-muted");//default
        mContainer.show("slow");

        mTextInput.show();
    }

    return {
        "hide": hide,
        "fadeOut": fadeOut,
        "show": show
    };
}

