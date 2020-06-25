/*
 *
 *closure to manage a startscreen with logo and login-dialoge
 *settings must contain
 *	parent: a jQuery Div
 *	onLogin: a function to be called if angel has logged in
 */
function createStartscreen(settings) {
    var mContainer;
    var mContainerFlex;
    var mContainerTitleLogin;
    var mLogoDiv;
    var mLogoImg;
    var mLogin;
    var mTitleContainer;
    var mTitleDiv;
    var mTitle;
    inflate();
    setup();
    setupCSS();

    function inflate() {

        mContainer = $("<div/>").attr("id", "startscreen-container").addClass("mt-4");
        mContainerFlex = $("<div/>");
        mContainerTitleLogin = $("<div/>");
        mTitleContainer = $("<div/>");

        settings.parent.append(mContainer);
        mTitleDiv = $("<div/>");
        mTitle = $("<h1/>").text("Angel Control Terminal").addClass("text-left mb-4 design-farat");
        var horizSpace = $("<div/>").css("width", "30%").css("height", "2.5rem").css("margin-right", "2rem");
        mTitleContainer.append(horizSpace);
        mTitleContainer.append(mTitleDiv);
        mTitleDiv.append(mTitle);
        mContainer.append(mTitleContainer);

        mContainer.append(mContainerFlex);


        mLogoDiv = $("<div/>");
        mLogoImg = $("<img/>").attr("src", "pics/Heaven_Logo_byFaratMaroon.svg");
        mLogoDiv.append(mLogoImg);
        mContainerFlex.append(mLogoDiv);
        mContainerFlex.append(mContainerTitleLogin);
    }

    function setup() {
        mLogin = createLogin({"parent": mContainerTitleLogin, "width": "60%", "onLogin": settings.onLogin});
    }

    function setupCSS() {
        mContainerFlex.css("width", "100%").css("display", "flex");
        mLogoDiv.css("width", "30%");
        mLogoDiv.css("margin-top", "3rem");//get same height as Login-Input
        mLogoDiv.css("text-align", "right");
        mLogoDiv.css("margin-right", "2rem");

        mLogoImg.css("padding-left", "10%");
        //mLogoImg.css("padding-top","20px");
        mLogoImg.css("width", "100%");
        mLogoImg.css("max-width", "270px");

        mContainerTitleLogin.css("width", "69%");


        mTitleContainer.css("width", "100%").css("display", "flex");


    }


    function hide() {
        mContainer.css("display", "none");
    }

    //aFunction is called after fading out finished
    function fadeOut(aFunction) {
        mContainer.fadeOut("slow", function () {
            mContainer.hide("slow");
            if (aFunction != undefined) {
                aFunction();
            }
        });
    }

    function show() {
        mContainer.show("fast");
    }

    //returns a dict with session info
    function getSession() {

    }

    //resets login ans makes dialoge visible
    function logout() {

    }

    function getLogin() {
        return mLogin;
    }


    return {
        "hide": hide,
        "fadeOut": fadeOut,
        "show": show,
        "getSession": getSession,
        "logout": logout,
        "getLogin": getLogin
    };

}