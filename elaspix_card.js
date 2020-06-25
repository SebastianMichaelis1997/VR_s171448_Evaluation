/*
 *closure to manage a card showing customer info
 *settings must provide
 *parent: a jQuery Div
 *customer: a JSON object with customer data 
 *onClick:function that is called if a card was clicked, passes the name as parameter
 *onDblClick:function that is called if a card was dbl-clicked, passes the name as parameter
 */
function createCard(settings) {
    var mContainer;
    var mIcon;
    var mIconHolder;
    var mProperties;
    var mName;
    var mSpent;
    var mState;


    inflate();
    setup();
    setupCSS();

    function inflate() {
        mContainer = $("<div/>").addClass("card-container");
        mIconHolder = $("<div/>");

        mIcon = $("<img/>").attr("src", settings.customer.iconurl);
        mIconHolder.append(mIcon);
        mContainer.append(mIconHolder);
        settings.parent.append(mContainer);

        mProperties = $("<div/>").addClass("card-properties");
        mContainer.append(mProperties);

        mName = $("<div/>").text("Nathan");
        mSpent = $("<div/>").text("1.200 $");
        mState = $("<div/>").text("happy");
        mProperties.append(mName);
        mProperties.append(mSpent);
        mProperties.append(mState);

        setName(settings.customer.name);
    }

    function setup() {
        mContainer.on("click touchstart", onClick);
        mContainer.on("dblclick", onDblClick);
        update();//sets state and spent

    }

    function setupCSS() {
        mContainer.css("width", "47%");
        mContainer.css("margin", "5px");
        mContainer.css("transition", "opacity 0.5s");


        mContainer.css("display", "flex");
        mContainer.css("padding", "10px");
        mContainer.css("border", "1px solid rgba(41,89,142,0.5)");
        mContainer.css("border-radius", "8px");
        mContainer.css("cursor", "pointer");
        mContainer.css("user-select", "none");
        mContainer.hover(hoverIn, hoverOut);
        mIconHolder.width("30%");
        mIconHolder.css("margin", "0px 15px 5px 0px");
        mIcon.css("width", "100%");
        mIcon.css("border-radius", "50%");
        mIcon.css("max-width", "60px");
        mIcon.css("margin-top", "0.5em");
        mProperties.css("width", "100%");
        mProperties.css("font-size", "22px");
        mProperties.css("line-height", "1.2em");

        mName.css("font-size", "24px");
        mName.css("color", "#29628E");
        mName.css("opacity", "0.44");
        mName.css("margin-bottom", "0.3em");
        mName.addClass("card-name");

        hoverOut();//set box-shadow
    }

    function hoverIn() {
        //mContainer.css("box-shadow","4px 4px 10px rgba(41,89,142,0.2)");
        mContainer.css("border", "1px solid #69A3DA");
    }

    function hoverOut() {
        //mContainer.css("box-shadow","4px 4px 7px rgba(0,0,0,0.1)");
        mContainer.css("border", "1px solid rgba(41,89,142,0.5)");
        //mContainer.css("opacity","0.4");

    }

    function onClick() {
        console.log(mName.text() + " was clicked");
        if (settings.onClick != undefined) {
            settings.onClick(mName.text());
        }
    }

    function onDblClick() {
        console.log(mName.text() + " was dbl clicked");
        if (settings.onDblClick != undefined) {
            settings.onDblClick(mName.text());
        }
    }

    function setName(aName) {
        mName.text(aName);
    }

    //internal function as the spent Value is set from the settings.customer.spent value
    function setSpent(aSpent) {
        mSpent.text(aSpent + " $");
    }

    //internal function as the state Value is set from the settings.customer.state value
    function setState(aState) {
        mState.text(aState);
    }

    function update() {
        setSpent(settings.customer.spent);
        setState(settings.customer.state);

    }

    function setActive(aIsActive) {
        if (aIsActive) {
            mContainer.css("opacity", "1.0");
        } else {
            mContainer.css("opacity", "0.3");
        }
    }

    function getContainerDiv() {
        return mContainer;
    }

    function getSpent() {
        return settings.customer.spent;
    }

    function getName() {
        return settings.customer.name;
    }


    return {

        "setActive": setActive,
        "update": update,
        "getContainerDiv": getContainerDiv,
        "getSpent": getSpent,
        "getName": getName

    };
}