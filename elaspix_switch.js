/**
 *closure for Bootstrap 4 Switches and Checkbox
 *updates the hint-text requires Bootstrap 4.4.1 (otherwise the switch is looking like a checkbox-quader)
 *
 **/


/*
 *settigns must contain
 *parent: jQuery Div
 *id: an id	
 *  title: a Text that is shown besides the checkbox
 *	oncheckboxclick		click event listener with one string parameter
 *	isclicked			string value if checkbox is clicked
 *	notclicked			string value if checkbox is not clicked
 *
 **/
function createSwitch(settings) {
    var mContainer;
    var mCheckbox;
    var mHint;
    var mLastValue;

    inflate();
    setup();
    setupCSS();

    function inflate() {

        mContainer = $("<div/>").addClass("custom-control custom-switch");


        mCheckbox = $("<input/>").attr("type", "checkbox").addClass("custom-control-input").attr("id", settings.id + "-input");
        var label = $("<label/>").addClass("custom-control-label").text(settings.title).attr("for", settings.id + "-input");
        mHint = $("<small/>").attr("id", settings.id + "-hint").addClass("form-text text-muted").text(settings.isClicked);

        mContainer.append(mCheckbox);
        mContainer.append(label);
        mContainer.append(mHint);
        settings.parent.append(mContainer);

    }

    function setup() {
        mCheckbox.click(onClick);
        if (mCheckbox.is(":checked")) mLastValue = settings.isclicked; else mLastValue = settings.notclicked;
    }

    function setupCSS() {
        //mContainer.css("padding","10px");
    }


    //user clicks on dropdown entry
    function onClick() {
        if (mCheckbox.is(":checked")) {
            mLastValue = settings.isclicked;
            mHint.text(settings.isclicked);
            settings.oncheckboxclick(settings.isclicked);
        } else {
            mLastValue = settings.notclicked;
            settings.oncheckboxclick(settings.notclicked);
            mHint.text(settings.notclicked);
        }
        //mCheckbox.text(aText);
        //settings.ondropdownclick(aText);//external clickListener
    }


    //public methods


    function getValue() {
        return mLastValue;
    }

    return {
        "getValue": getValue //get the value of the button
    };
}