/**
 *closure for input texts with label, input-field and hint
 *settings contains
 *	parent : a jQuery div
 *	id : the unique id
 *	labelText:the text for the label
 *	inputPlaceholder: the text hint for the input
 *	inputType: the type of the input {email,text,..}
 *	hintText: the text for the hint
 *	width: css property
 *	[onKeypress]: event Handler when a key is pressed
 *	[marginBottom]: optional lineheight for the form group to set it to 0 removes vertical margin and make the form look more compact
 *	[paddingBottom]: optional lineheight for the form group to set it to 0 removes vertical margin and make the form look more compact
 **/


function createInputtext(settings)
{
	var mContainer;
	var mLabel;
	var mInput;
	var mHint;
	
	inflate();
	setupCSS();

	function inflate()
	{
		mContainer=$("<div/>").attr("id",settings.id);
		mLabel=$("<label/>").text(settings.labelText).attr("for",settings.id+"-input");
		mInput=$("<input/>").attr("id",settings.id+"-input").attr("placeholder",settings.inputPlaceholder).attr("type",settings.inputType);
		if (settings.onKeypress!=undefined)
		{
			mInput.on("keypress",settings.onKeypress);
		}
		mHint=$("<small/>").text(settings.hintText);
		
		mContainer.append(mLabel);
		mContainer.append(mInput);
		mContainer.append(mHint);
		settings.parent.append(mContainer);
  
	}
	
	function setupCSS()
	{
		mContainer.addClass("form-group");
		if (settings.marginBottom!=undefined)
		{
			mContainer.css("margin-bottom",settings.marginBottom);
		}
		mContainer.css("width",settings.width).css("padding","10px");
		if (settings.paddingBottom!=undefined)
		{
			mContainer.css("padding-bottom",settings.paddingBottom);
		}
		mInput.addClass("form-control");
		mInput.css("font-size","0.8rem");//to be as high as the dropdown text
		//mInput.css("line-height","1em");//make as high as the dropdown-buttons
		mHint.addClass("form-text text-muted");
	}
	
	
	function setLabelText(aText)
	{
		mLabel.text(aText);
	}
	
	function getValue()
	{
		return mInput.val();
	}
	
	function setInputValue(aValue)
	{
		return mInput.val(aValue);
	}
	
	
	function setHintText(aText)
	{
		mHint.text(aText);
	}
	
	function setHintTextHTML(aHTML)
	{
		mHint.html(aHTML);
	}
	
	//aHintObjects is a list of tuples with hint:text and click:function-Properties
	function setHint(aHintObjects)
	{
		mHint.empty();
		$.each(aHintObjects,function(index,hintObject){
					var span=$("<span/>").text(hintObject.hint);
					if (hintObject.hasOwnProperty("click"))
					{
						span.css("text-decoration","underline").css("cursor","pointer");
						span.on("click",hintObject.click);
					}
					
					if (hintObject.hasOwnProperty("cssClass"))
					{
						span.addClass(hintObject.cssClass);
					}
					mHint.append(span);
				});
	}
	
	function setHintClass(aClass)
	{
		mHint.removeClass();
		mHint.addClass("form-text");//padding
		
		mHint.addClass(aClass);
		if (aClass!="text-danger" && aClass!="text-warning" && aClass!="text-success")
		{//show gray color only if text-danger is not given which forces to show text in red
			mHint.addClass("text-muted");//gray
		}
	
	}
	
	function fadeOut()
	{
		mContainer.fadeOut("slow",function(){mContainer.hide("slow");});		
	}
	
	function hide()
	{
		mContainer.css("display","none");
	}
	
	function show()
	{
		mContainer.show("slow");
		//mContainer.css("display","block");
	}
	
	
	return {
		"setLabelText":setLabelText,
		"setInputValue":setInputValue,
		"setHintText":setHintText,
		"setHintTextHTML":setHintTextHTML,
		"setHint":setHint,//replaces the html content and appends the passed jQuery-Object
		"getValue":getValue,
		"setHintClass":setHintClass,
		"hide":hide,
		"fadeOut":fadeOut,
		"show":show
	};
}