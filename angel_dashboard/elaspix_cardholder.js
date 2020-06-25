/*
 *closure to hold a couple of cards and sort them
 *settings must contain
 *	parent: a jQuery-Div
 *	map: the Map (used to center the customer on the map)
  *	onDblClick: function to be called when a customer is double clicked (to open the detail dialog)
 *
 */
function createCardholder(settings) {
    var mContainer;
    var mCards = {};//dict mapping of name to its card
    var mCardsArray = [];
    var mIsVisible;
    inflate();
    setupCSS();


    function inflate() {
        mContainer = $("<div/>").attr("id", "cardholder-container");
        settings.parent.append(mContainer);
    }

    function setupCSS() {
        mContainer.css("display", "flex");
        mContainer.css("flex-wrap", "wrap");
    }

    function fadeOut() {
        mIsVisible = false;
        mContainer.fadeOut("slow", function () {
            mContainer.hide("slow");
        });

    }

    function hide() {
        mIsVisible = false;
        mContainer.css("display", "none");

    }

    function show() {
        mIsVisible = true;
        mContainer.css("display", "flex");

    }

    function addCard(aCustomerJSON) {
        var card = createCard({
            "parent": mContainer,
            "customer": aCustomerJSON,
            "onClick": onClick,
            "onDblClick": onDblClick
        });
        mCards[aCustomerJSON.name] = card;
        mCardsArray.push(card);
        card.setActive(false);
        if (settings.map != undefined) {
            settings.map.addPin(aCustomerJSON.name, aCustomerJSON.position);
        }
    }

    function onClick(aCardName) {
        if (settings.map != undefined) {
            settings.map.centerMap(aCardName);
        }
        for (var cardName in mCards) {
            var card = mCards[cardName];
            if (cardName == aCardName) {
                card.setActive(true);
            } else {
                card.setActive(false);
            }
        }
    }

    function onDblClick(aName) {
        if (settings.onDblClick != undefined) {
            settings.onDblClick(aName);
        }
    }

    function inflateEmptyCards(aNumber) {
        for (var i = 0; i < aNumber; i++) {
            var card = createCard({
                "parent": mContainer,
                "iconurl": "pics/speckboy_avatare/36-user_dummy.svg",
                "onClick": undefined,
                "onDblClick": undefined
            });
            card.setName("Maxi");
            card.setState("happy");
            card.setSpent("0 $");
            mCardsArray.push(card);
            //mCards[aName]=card;
        }
    }

    //clears the cards
    function empty() {
        mContainer.empty();
        mCardsArray = [];
        mCards = {};
    }

    function updateCard(aName) {
        if (mCards.hasOwnProperty(aName)) {
            mCards[aName].update();
        }
    }

    //sorts cards and repositions them in the DOM-Tree
    function resortCards() {
        mCardsArray.sort(sort);//sort in ascending order
        //console.log("sorted cards:");
        for (var i = 0; i < mCardsArray.length; i++) {
            var card = mCardsArray[i];
            //console.log(card.getName()+" "+card.getSpent());
            mContainer.prepend(card.getContainerDiv());
        }


    }

    function sort(aCard1, aCard2) {
        if (aCard1.getSpent() < aCard2.getSpent()) return -1;
        if (aCard1.getSpent() > aCard2.getSpent()) return +1;
        return 0;
    }

    return {
        "hide": hide,
        "fadeOut": fadeOut,
        "show": show,
        "addCard": addCard,
        "inflateEmptyCards": inflateEmptyCards,
        "empty": empty,
        "updateCard": updateCard,
        "resortCards": resortCards
    };
}

