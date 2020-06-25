/*
 *
 *closure to manage a dashboard of Upload-Customers
 *settings must contain
 *	row1: a jQuery Div of the first row
 *	col1: a jQuery Div of the first column in 2nd row
 *	col2: a jQuery Div of the second column in 2nd row
 *	row3: a jQuery Div of the first row
 */
function createDashboard(settings) {


    var mMenuBar;
    var mStartScreen;
    var mLogin;
    var mMap;
    var mCloudAdapter;
    var mCardHolder;
    var mFirstUpdate = true;
    var mCustomerDialogsRow = settings.row3;

    var mCustomers = {};//dict from customerName to its JSONObject, is used as reference for cards and customerDialog, never delete or overwrite it, just update fields
    var mCustomerDialogs = {};//dict from customername to open customer Dialog

    inflate();
    setup();
    setupCSS();

    onAuthResult(true);//just for testing

    function inflate() {
        mMenuBar = createMenubar({"parent": settings.row1, "onLogout": onLogout});
        mMenuBar.hide();

        mMap = createVRMap({"parent": settings.col2, "isDraggable": false});
        mMap.hide();
        mStartScreen = createStartscreen({"parent": settings.row1, "onLogin": onLogin});
        mLogin = mStartScreen.getLogin();
        mCardHolder = createCardholder({"parent": settings.col1, "map": mMap, "onDblClick": onCardDblClick});
        mCardHolder.hide();
    }

    function setup() {
        mCloudAdapter = createCloudAdapter({"log": $("#log"), "cardholder": mCardHolder});

    }

    function loadCustomers() {
        mCloudAdapter.loadCustomersForAngel(mLogin.getSession().email, updateCard);
        updateCustomers();
    }

    function updateCustomers() {
        mCardHolder.resortCards();//sorts the card in ascending order by spent-Money
        for (var customerName in mCustomers) {
            //console.log("retrieve update for "+customerJSON.name);
            //console.log(customerJSON);
            mCloudAdapter.retrieveCustomerData(customerName, updateCard);
        }
        console.log("updateCustomers");
        setTimeout(updateCustomers, 5000);
    }


    //is called when the data has arrived or is updated for the customer
    function updateCard(aCustomerJSON) {

        if (mCustomers.hasOwnProperty(aCustomerJSON.name)) {
            //make an upate
            var customerJSONPermanent = mCustomers[aCustomerJSON.name];
            if (customerJSONPermanent != undefined) {
                customerJSONPermanent.state = aCustomerJSON.state;
                customerJSONPermanent.spent = aCustomerJSON.spent;
                customerJSONPermanent.position.x = aCustomerJSON.position.x;
                customerJSONPermanent.position.y = aCustomerJSON.position.y;
                mCardHolder.updateCard(aCustomerJSON.name);

                if (mCustomerDialogs.hasOwnProperty(aCustomerJSON.name)) {
                    mCustomerDialogs[aCustomerJSON.name].update();
                }
            }

        } else {
            //create the card
            mCustomers[aCustomerJSON.name] = aCustomerJSON;//the customer name must be unique
            mCardHolder.addCard(aCustomerJSON);
        }
    }


    function setupCSS() {
        //mContainerFlex.css("width","100%").css("display","flex");

        mCustomerDialogsRow.hide();
    }


    //called from startScreen|login when angel has logged in
    function onLogin(aAngel, aPwClear) {
        mLogin.setHintState("authenticate");
        mCloudAdapter.authenticateAngel(aAngel, aPwClear, onAuthResult);

    }

    function onAuthResult(aIsAuthenticated) {
        if (aIsAuthenticated) {
            mLogin.setHintState("authenticated");
            mMenuBar.setName(mLogin.getSession().email);
            mStartScreen.fadeOut(function () {
                empty();
                mMenuBar.show();
                mMap.show();
                loadCustomers();
                mCardHolder.show();
                mCustomerDialogsRow.show();
            });
        } else {
            mLogin.setHintState("denied");
        }
    }

    //before new customers are loaded, clear the old ones
    function empty() {
        mCustomerDialogs = {};
        mCustomers = {};
        mCustomerDialogsRow.empty();
        mCardHolder.empty();
        mMap.empty();

    }

    function onLogout() {
        mMenuBar.fadeOut();
        mMap.fadeOut(function () {
            mStartScreen.show();
        });
        mCardHolder.fadeOut();
        mCustomerDialogsRow.fadeOut();
    }

    //called from cardHolder when a card id double clicked
    function onCardDblClick(aName) {
        console.log("dbl click on " + aName);


        if (mCustomers.hasOwnProperty(aName) && mCustomerDialogs.hasOwnProperty(aName) == false)//if customer is known but a detail dialog not yet open
        {
            var customerJSON = mCustomers[aName];
            var customerDialog = createCustomerdialog({
                "parent": mCustomerDialogsRow,
                "customer": customerJSON,
                "onClose": onRemoveCustomerDialog,
                "onUpgrade": onUpgrade
            });
            mCustomerDialogs[aName] = customerDialog;
        }
    }

    function onUpgrade(aCustomerName, aUpgrade) {
        var upgradeName = aUpgrade.split(" ")[0];
        var price = (aUpgrade.split(" ")[1]).slice(0, -1);//remove the $ sign at the end

        if (mCustomers.hasOwnProperty(aCustomerName)) {//show the spent money immediately and resort cards even if the data is not yet updated in the cloud
            mCustomers[aCustomerName].spent += parseFloat(price);
            mCardHolder.updateCard(aCustomerName);
            mCustomerDialogs[aCustomerName].update();
            mCardHolder.resortCards();
        }

        mCloudAdapter.buyUpgrade(aCustomerName, upgradeName, price);
    }

    function onRemoveCustomerDialog(aName) {
        delete mCustomerDialogs[aName];
    }


    function getMap() {
        return mMap;
    }


    return {
        "getMap": getMap

    };

}