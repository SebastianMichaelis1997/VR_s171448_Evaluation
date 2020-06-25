/*
 *closure to manage costumer controls
 *
 *settings with
 *parent a jQuery Div which is a bootstrap row
 *customer: customer JSONObject
 *onClose: function to be called when the close button is pressed
 *onUpgrade: function to be called when an Upgrade is bought
 *
 */
function createCustomerdialog(settings) {
    var mRow;
    var mColumn1;
    var mColumn2;
    var mIcon;
    var mSlider;
    var mCloseButton;

    var mSpentDiv;
    var mStateDiv;

    inflate();
    setup();
    setupCSS();
    mRow.show("slow");

    function inflate() {
        mRow = $("<div/>").addClass("row").addClass("customer-row");//bootstrap row
        mRow.hide();//is shown animated
        mColumn1 = $("<div/>").addClass("col-md-6  col-sm-12 text-center").attr("id", "customerdialog-col1");

        mColumn2 = $("<div/>").addClass("col-md-6  col-sm-12").attr("id", "customerdialog-col2");
        settings.parent.prepend(mRow);
        mRow.append(mColumn1);
        mRow.append(mColumn2);
        inflateCol1();
        inflateCol2();
        mCloseButton = $("<div/>").text("x");
        mRow.append(mCloseButton);

    }

    function setup() {
        mCloseButton.on("click touchstart", onClose);
    }

    function setupCSS() {
        mRow.css("user-select", "none");
        mRow.css("border", "1px solid rgba(41,89,142,0.5)");
        mRow.css("border-radius", "10px");
        mRow.css("padding", "10px 0 20px 0");
        //mRow.css("margin","10px 0 10px 0");
        //mRow.css("margin","auto");
        mRow.css("margin", "10px auto 10px auto");
        mRow.css("max-width", "780px");

        mRow.css("position", "relative");//to be used as reference for closeButton positioning


        mCloseButton.css("position", "absolute").css("right", "20px").css("top", "0px");
        mCloseButton.css("font-size", "1.5rem");
        mCloseButton.css("cursor", "pointer");
        mCloseButton.css("padding", "5px");//increase area to be clicked on
        mCloseButton.addClass("text-muted");

        mColumn1.css("min-height", "22em");//make sure that addProps are not interfere with image in mobile-1column-resolution
        mColumn1.css("margin-top", "20px");
        mColumn2.css("margin-top", "20px");
    }

    function inflateCol1() {
        mIcon = $("<img/>").attr("src", settings.customer.iconurl);
        mIcon.css("width", "30%");
        mIcon.css("padding", "1%").css("margin-top", "5%");
        //mIcon.css("border","1px solid black");
        var customerName = $("<div/>").text(settings.customer.name).addClass("card-name");
        customerName.css("font-size", "24px");
        customerName.css("color", "#29628E").css("opacity", "0.44");
        mColumn1.append(mIcon);
        mColumn1.append(customerName);

        var divAddProps = $("<div/>").css("display", "flex").css("text-align", "left").css("padding-left", "5%").addClass("mt-4 card-properties");
        divAddProps.css("position", "absolute").css("bottom", 0).css("width", "100%");//the the div to the bottom
        divAddProps.css("color", "0F2C48");
        divAddProps.css("font-size", "22px");
        var divAddPropsCol1 = $("<div/>").css("width", "50%");
        var divAddPropsCol2 = $("<div/>").css("width", "50%");

        divAddProps.append(divAddPropsCol1);
        divAddProps.append(divAddPropsCol2);
        mColumn1.append(divAddProps);

        addParamValue(divAddPropsCol1, divAddPropsCol2, "Room-Nr.", settings.customer.room);
        addParamValue(divAddPropsCol1, divAddPropsCol2, "Creditcart", settings.customer.creditcard);
        addParamValue(divAddPropsCol1, divAddPropsCol2, "Date of Upload", settings.customer.dateofupload);
    }

    function inflateCol2() {
        var actValues = ["awake", "tired", "asleep"];
        mSlider = createSlider({
            "parent": mColumn2,
            "id": "customer-activation",
            "label": "Activation Level",
            values: actValues
        });


        var upgradeList = ["Rennpferd 1500$", "Golfschläger-gold 2000$", "Premium-Frühstück 200$", "Sportlook 5000$"];//<name><space><price>$
        createDropdowndesktop({
            "parent": mColumn2, "id": "upgrades", "labelText": "Upgrade",
            "titleText": upgradeList[0], "listValues": upgradeList, "width": "100%",
            "onChange": onUpgrade
        });

        var divAddProps = $("<div/>").css("display", "flex").css("text-align", "left").css("padding-left", "10px").addClass("mt-4 card-properties");
        var divAddPropsCol1 = $("<div/>").css("width", "50%");
        var divAddPropsCol2 = $("<div/>").css("width", "50%");
        divAddProps.css("color", "0F2C48");
        divAddProps.css("font-size", "22px");

        divAddProps.append(divAddPropsCol1);
        divAddProps.append(divAddPropsCol2);
        mColumn2.append(divAddProps);
        mSpentDiv = addParamValue(divAddPropsCol1, divAddPropsCol2, "Money spent day", settings.customer.spent + " $");
        mStateDiv = addParamValue(divAddPropsCol1, divAddPropsCol2, "Emotional State", settings.customer.state);
    }

    function onUpgrade(aUpgrade) {
        console.log("upgrade bought " + aUpgrade);
        if (settings.onUpgrade != undefined) {
            settings.onUpgrade(settings.customer.name, aUpgrade);
        }
    }

    function addParamValue(aCol1, aCol2, aParam, aValue) {
        aCol1.append($("<div/>").text(aParam));
        var div = $("<div/>").text(aValue);
        aCol2.append(div);
        return div;
    }

    function onClose() {
        if (settings.onClose != undefined) {
            settings.onClose(settings.customer.name);
        }
        mRow.hide("slow");

    }

    function update() {
        mSpentDiv.text(settings.customer.spent + " $");
        mStateDiv.text(settings.customer.state);
    }

    return {
        "update": update
    };


}
