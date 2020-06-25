/* closure to wrap a desktop dropdown menu
 *
 * settings contain
 * parent: jQuery Div
 * id: id of the dropdown-group
 * labelText: 
 * titleText: the button's default value
 * listValues: a list of Values that are used as drop down values
 * width: css property
 * onChange: event listener that is called if something changes
 *
 * */
function createDropdowndesktop(settings)
{
	
	var mContainer;
	var mMenu;
	var mButton;	
	var mLastValue="";
	
	inflate();
	setupCSS();
	
	function inflate()
	{
		mContainer=$("<div/>");
		mContainer.css("width",settings.width).css("padding","10px");
		
		var label=$("<label/>").text(settings.labelText);
		var dropdown=$("<div/>").addClass("dropdown");
		mButton=$("<button/>").addClass("btn btn-outline-secondary dropdown-toggle");
		mButton.attr("id",settings.id+"-button");
		mButton.attr("type","button").attr("data-toggle","dropdown");
		
				
		mButton.text(settings.titleText);		
		mMenu=$("<div/>").addClass("dropdown-menu");
		
		mContainer.append(label);
		mContainer.append(dropdown);
		dropdown.append(mButton);
		
		dropdown.append(mMenu);
		
		settings.parent.append(mContainer);		
		setValues(settings.listValues);
	}
	
	function setValues(aValues)
	{		
			
			mMenu.empty();
			$.each(aValues,function(index,value){
			console.log("value="+value);
			var entry=$("<div/>").addClass("dropdown-item").text(value);
			entry.on("click",function(){onValueSelect(value);});
			entry.css("cursor","pointer").css("user-select","none");
			entry.css("word-wrap","break-word");
			entry.css("overflow","hidden");			
			mMenu.append(entry);			
			});
	}
	
	function onValueSelect(aValue)
	{
		console.log("onValueSelect with Value "+aValue);
		mButton.text(aValue);
		
		
		if (settings.onChange!=undefined)
		{
			mLastValue=aValue;//only fire if the value is new
			settings.onChange(aValue);
		}
	}
	
	function setupCSS()
	{
		
	}
	
	function getValue()
	{
		return mButton.text();
	}
	
	return {
		"setValues":setValues,
		"getValue":getValue,
	};
	
	
}