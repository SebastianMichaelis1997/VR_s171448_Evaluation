/*
 *closure to show a menubar
 *settings must contain
 *	parent: a jQuery Div
 *	onLogout: function to be called if ouser clicks on logout
 *
 */
function createMenubar(settings) {
    var mContainer;

    var mTime;
    var mLogout;
    var mName;
    var mLogo;

    inflate();
    setup();
    setupCSS();
    updateTime();

    function inflate() {
        mContainer = $("<div/>").attr("id", "menubar-container");
        settings.parent.append(mContainer);

        mLogo = $("<img/>").attr("src", "pics/Heaven_Logo_byFaratMaroon.svg");
        mContainer.append(mLogo);


        mTime = $("<span/>").text("11:13");
        mContainer.append(mTime);


        mName = $("<span/>").text("Account Name");
        mContainer.append(mName);

        //mLogout=$("<img/>").attr("src","pics/log-out_dark.svg");
        mLogout = $("<span/>").text("Log out");
        mContainer.append(mLogout);
    }

    function setup() {
        mLogout.on("click touchstart", onLogout);
    }

    function setupCSS() {

        mContainer.css("width", "100%");
        //mContainer.css("height","60px");
        mContainer.css("padding", "5px");
        mContainer.css("text-align", "right");
        mContainer.css("border", "2px none #BCBCBC");
        mContainer.css("border-bottom-style", "solid");
        mContainer.css("user-select", "none");

        mLogo.css("height", "40px");
        mLogo.css("position", "absolute");
        mLogo.css("left", "10px");
        mLogo.css("top", "5px");


        mTime.css("font-size", "50px");
        mTime.css("position", "absolute");
        mTime.css("right", "50%");
        mTime.css("top", "-15px");
        //mTime.css("margin-right","250px");


        mName.css("position", "relative");
        mName.css("right", "0");
        mName.css("font-size", "30px");

        mLogout.css("position", "relative");
        mLogout.css("right", "0");
        mLogout.css("font-size", "30px");
        mLogout.css("margin-left", "15px");
        mLogout.css("color", "#20B1B4");
        mLogout.css("cursor", "pointer");
        //mLogout.css("top","1vw");

    }

    function onLogout() {
        if (settings.onLogout != undefined) {
            settings.onLogout();
        }
    }

    function updateTime() {
        var now = new Date();
        mTime.text(now.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}));
        setTimeout(updateTime, 60000);//update time each 60seconds
    }

    function hide() {
        mContainer.css("display", "none");
    }

    function fadeOut() {
        mContainer.fadeOut("slow", function () {
            mContainer.hide("slow");
        });
    }

    function show() {
        mContainer.show("slow");
    }

    function setName(aName) {
        mName.text(aName);
    }

    return {
        "hide": hide,
        "fadeOut": fadeOut,
        "show": show,
        "setName": setName

    };
}