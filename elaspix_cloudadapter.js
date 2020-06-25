/*
 *closure to abstract all cloud communication
 *
 *settings must contain fields:
 *log: a method to show log entries
 *cardholder: a cardholder that shows the customer info
 *add functionality here to send the status upates to the cloud
 */
function createCloudAdapter(settings) {
    var mToken_upload_customer = "9nsjEvuXDwiwTJOwievRMxfHbfw_";
    // var mToken_upload_customer = "UaeObe4TeZxM7J5sAZESM_7xGvc_";
    var mCloudBase = "https://webtechlecture.appspot.com/cloudstore";


    function loadCustomersForAngel(aAngel, aFunctionToBeCalledAfterResponse) {
        var url = mCloudBase + "/get?owner=upload_angel&key=" + aAngel;
        $.getJSON(url, function (response) {
            if (response.hasOwnProperty("status") && response.hasOwnProperty == "failed") {
                log("could not retrieve data for angel " + aAngel);
            } else {
                var customerNames = response.customers;
                $.each(customerNames, function (index, name) {
                    retrieveCustomerData(name, aFunctionToBeCalledAfterResponse);
                });
            }
        });
    }


    function retrieveCustomerData(aCustomerName, aFunctionToBeCalledAfterResponse) {
        var url = mCloudBase + "/get?owner=upload_customer&key=" + aCustomerName;
        if (aCustomerName != undefined) {
            $.getJSON(url, function (response) {
                if (response.hasOwnProperty("status") && response.hasOwnProperty == "failed") {
                    log("could not retrieve customer data for " + aCustomerName);
                } else {
                    aFunctionToBeCalledAfterResponse(response);
                }

            });
        } else {
            console.log("aCustomerName is undefined -> do not retrieveCustomerData");
        }
    }


    function retrieveCustomerDataBulk(aCustomerNames, aFunctionToBeCalledAfterResponse) {


        var nameMap = {};//create a hashMap to check the list of all customers
        $.each(aCustomerNames, function (index, name) {
            nameMap[name] = true;
        });


        var url = mCloudBase + "/listobjects?owner=upload_customer";
        $.getJSON(url, function (response) {
            if (response.hasOwnProperty("status") && response.hasOwnProperty == "failed") {
                log("could not retrieve customers");
            } else {
                var customersJSON = [];
                $.each(response, function (index, cloudstoreJSON) {

                    if (nameMap.hasOwnProperty(cloudstoreJSON.jsonstring.name) == true) {
                        customersJSON.push(cloudstoreJSON.jsonstring);
                    } else {
                        console.log("skip customer " + cloudstoreJSON.jsonstring.name + " as it is not the actual angel's customer");
                    }

                });
                aFunctionToBeCalledAfterResponse(customersJSON);
            }

        });

        //var nathan={"name":"Nathan Brown","spent":"1.200$","state":"happy","iconurl":"pics/pixabay/woman1.jpg","x":200,"y":400,"room":"2055","creditcard":"Mastercard","dateofupload":"09.06.20"};
        //var caren={"name":"Nora Antony","spent":"1.200$","state":"happy","iconurl":"pics/pixabay/woman2.jpg","x":100,"y":300,"room":"2055","creditcard":"Mastercard","dateofupload":"09.06.20"};
        //var nico={"name":"Aleesha","spent":"1.200$","state":"happy","iconurl":"pics/pixabay/woman3.jpg","x":500,"y":40,"room":"2055","creditcard":"Mastercard","dateofupload":"09.06.20"};
        //var max={"name":"Luke","spent":"1.200$","state":"happy","iconurl":"pics/pixabay/man1.jpg","x":500,"y":100,"room":"2055","creditcard":"Mastercard","dateofupload":"09.06.20"};
        //var paul={"name":"Ingrid Kannerman","spent":"1.200$","state":"happy","iconurl":"pics/pixabay/man2.jpg","x":600,"y":700,"room":"2055","creditcard":"Mastercard","dateofupload":"09.06.20"};
        //var titus={"name":"A.I. Guy","spent":"1.200$","state":"happy","iconurl":"pics/pixabay/man3.jpg","x":100,"y":40,"room":"2055","creditcard":"Mastercard","dateofupload":"09.06.20"};
        //aFunctionToBeCalledAfterResponse([nathan,caren,max,nico,paul,titus]);


    }

    function authenticateAngel(aAngelName, aPwClear, aFuncAuthResult) {
        var applicationName = "heaven_angel_control_terminal";
        var seed = getMurmurSeed(applicationName);
        var pwHash = murmurhash3_32_gc(encodeURIComponent(applicationName + aPwClear), seed);

        var url = mCloudBase + "/get?owner=upload_angel&key=" + aAngelName;
        $.getJSON(url, function (response) {
            if (response.hasOwnProperty("status") && response.hasOwnProperty == "failed") {
                log("could not retrieve data for " + aAngelName);
            } else {
                if (response.pwhash == pwHash) {
                    aFuncAuthResult(true);
                } else {
                    aFuncAuthResult(false);
                }
            }
        });


    }

    function inflateCustomerList() {
        //var customers=getCustomerList();

    }

    //added by TG (elaspix) to generate an application specific seed from a prefix
    function getMurmurSeed(aPrefix) {

        var sum = 0;
        for (var i = 0; i < aPrefix.length; i++) {
            sum += aPrefix.charCodeAt(i);
        }
        return sum % 32003;//just make sure the seed do not exceeed 32003 to become negative (if its much much larger)
    }

    function buyUpgrade(aName, aUpgrade, aPrice) {
        aPrice = parseFloat(aPrice);
        var url = mCloudBase + "/get?owner=upload_customer&key=" + aName;
        $.getJSON(url, function (response) {
            if (response.hasOwnProperty("status") && response.hasOwnProperty == "failed") {
                log("could not retrieve data for " + aName);
            } else {
                var customerJSON = response;
                if (customerJSON.upgrades.length > 5) {
                    customerJSON.spent = 0;
                    customerJSON.upgrades = [];
                    log("clear upgrades for " + aName);
                } else {
                    customerJSON.spent = customerJSON.spent + aPrice;
                    customerJSON.upgrades.push(aUpgrade);
                }

                updateCustomer(customerJSON);
            }

        });
        log(aName + " buys " + aUpgrade + " for " + aPrice + "$");
    }

    function updateCustomer(aCustomerJSON) {
        var url = mCloudBase + "/add?owner=upload_customer&token=" + mToken_upload_customer + "&key=" + aCustomerJSON.name + "&jsonstring=" + encodeURIComponent(JSON.stringify(aCustomerJSON));

        console.log("url for init customer:");
        console.log(url);
        $.getJSON(url, function (response) {
            if (response.status == "ok") {
                log("customer update for " + aCustomerJSON.name + " successful");
            } else {
                log("customer update fails: " + response);
            }
        });
    }


    return {
        "loadCustomersForAngel": loadCustomersForAngel,
        "retrieveCustomerData": retrieveCustomerData,
        "inflateCustomerList": inflateCustomerList,
        "authenticateAngel": authenticateAngel,
        "buyUpgrade": buyUpgrade

    };
}