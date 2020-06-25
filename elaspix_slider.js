/*
 *closure to manage a slider with labels
 *
 *setings contains
 *parent: a jQuery-Div
 *id 
 *label: text shown above the slider
 *values: list of values
 */
function createSlider(settings) {

    var mInput;
    var mLabel;
    var mTicks;
    var mContainer;
    var mValue;

    inflate();
    setup();
    setupCSS();

    function inflate() {
        mContainer = $("<div/>").attr("id", settings.id + "-container").css("padding", "10px");
        settings.parent.append(mContainer);

        mLabel = $("<label/>").attr("for", settings.id).text(settings.label);
        mLabel.addClass("design-farat");
        mTicks = $("<div/>").css("height", "1.3em").css("position", "relative").addClass("slider-ticks");
        createTicks(mTicks, settings.values);
        mInput = $("<input/>").attr("type", "range").addClass("custom-range").attr("id", settings.id);
        mInput.attr("min", "0").attr("max", settings.values.length - 1);
        mInput.on("input", onInput);

        mContainer.append(mLabel);
        mContainer.append(mTicks);
        mContainer.append(mInput);
    }

    function setup() {
        mInput.val(1);
        onInput();//init mValue
    }

    function setupCSS() {
        //mInput.css("color","red");
        mLabel.css("font-weight", "600");
    }

    function createTicks(aDiv, aList) {
        var number = 0;
        var dWidth = 100 / (aList.length - 1);
        var dEpsilonPercent = 6;
        $.each(aList, function (index, value) {
            var tick = $("<small/>").text(value);
            tick.css("position", "absolute").addClass("design-farat");
            tick.css("left", (number * dWidth - number * dEpsilonPercent) + "%");
            number++;
            aDiv.append(tick);
        });
    }

    function onInput() {

        mValue = settings.values[mInput.val()];
    }

    function getValue() {
        return mValue;
    }


    return {
        "getValue": getValue
    };
}