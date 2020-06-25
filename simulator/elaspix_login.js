/* closure for login dialoge
 *
 * settings contains
 * parent: a jQuery Div
 * parentColumn1: parent Div column1
 * parentColumn2: parent Div column2
 * onRegister: event lister that is called when the user wants to register
 * onLogin: function that is called when the user has successfully logged in
 *
 * */
function createLogin(settings)
{
	var mContainerFlex;
	var mContainer;	
	var mEmailInput;
	var mPasswordInput;
	var mOKButton;
	var mDivGroupOKButton;
	var mOKButtonBeak;
	var mHintStates={};//dict to store hint-states {login, saveConfig}
	var mHintState="login";
	var mSession={"loggedin":false,"email":"defaultuser@elaspix.de","password":undefined};//store data of actual logged in user //the defaultuser is used for anonymous text und image-uploads
	inflate();
	setupCSS();
	hide();
	
	
	
	function inflate()
	{
		mContainer=$("<div/>").attr("id","login-container");
		mContainerFlex=$("<div/>");
		mContainer.append(mContainerFlex);
		settings.parentColumn2.append(mContainer);
		
		mEmailInput=createInputtext({"parent":settings.parentColumn1,"id":"login-email","width":"80%",
										  "labelText":"Login","inputPlaceholder":"Ihre eMail","inputType":"email",
										  "hintText":"",
										  "onKeypress":onKeypress});
		
		
		mPasswordInput=createInputtext({"parent":mContainerFlex,"id":"login-passwords","width":"80%",
										  "labelText":"Passwort","inputPlaceholder":"Ihr Passwort","inputType":"password",
										  "hintText":"",
										  "onKeypress":onKeypress});
		mDivGroupOKButton=$("<div/>");
		mOKButtonBeak=$("<br/>");
		mDivGroupOKButton.append(mOKButtonBeak);
		mOKButton=$("<button/>").attr("type","button").text("OK");
		mDivGroupOKButton.append(mOKButton);
		mContainerFlex.append(mDivGroupOKButton);
		mOKButton.on("click touchstart",onOKButton);
		
		mHintStates.login=[{"hint":"Bitte einloggen "},{"hint":"oder ","cssClass":"d-none d-lg-inline"},{"hint":"registrieren","click":onRegister,"cssClass":"d-none d-lg-inline"}];
		mHintStates.saveConfig=[{"hint":"Zum Speichern der Konfiguration bitte einloggen"},
								{"hint":"  (noch nicht ","cssClass":"d-none d-lg-inline"},
								{"hint":"registriert","click":onRegister,"cssClass":"d-none d-lg-inline"},
								{"hint":"?)","cssClass":"d-none d-lg-inline"}];		
		updateHintText();
		
	}
	
	
	
	function setupCSS()
	{
		mContainerFlex.css("width","100%").css("display","flex");
		mDivGroupOKButton.addClass("form-group");
		mDivGroupOKButton.css("padding","10px");
		mOKButtonBeak.css("line-height","2em");//enforce line break
		mOKButton.addClass("btn btn-primary");
		
		
		
	}
	
	//user has pressed the register text
	function onRegister()
	{
		if (settings.onRegister!=undefined)
		{
			settings.onRegister();
			hide();
			
		}
	}
	
	
	
	function onKeypress()
	{
		//just reset the warning message in case of input
		updateHintText();
		mEmailInput.setHintClass("");
		mPasswordInput.setHintText("");
	}
	
	function onOKButton()
	{
		var email=mEmailInput.getValue();
		var missingData=false;
		if (email==undefined || email.length<2 || email.indexOf("@")<0)
		{
			mEmailInput.setHintText("bitte geben Sie eine gültige Email ein!");
			mEmailInput.setHintClass("text-danger");
			missingData=true;
		}
		
		var password=mPasswordInput.getValue();		
		if (password==undefined || password.length<2)
		{
			mPasswordInput.setHintText("bitte geben Sie Ihr Passwort ein!");
			mPasswordInput.setHintClass("text-danger");
			missingData=true;
		}
		
		if (missingData==false)
		{//check account
			
			mPasswordInput.setHintText("prüfe Account... bitte warten");
			mPasswordInput.setHintClass("text-warning");
			
			var urlIsRegisteredPrefix="https://bussestrainsusers.appspot.com/bussestrainsusers/isregistered?format=json";
			var url=urlIsRegisteredPrefix+"&accountid="+email+"&pw="+password;
			$.getJSON(url,function(response){
				console.log("server response:");
				console.log(response);
					
				if (response.status=="ok")
				{
					mSession.loggedin=true;
					mSession.email=email;
					mSession.password=password;
					
					mEmailInput.setHintText("Account wurde erkannt");
					mEmailInput.setHintClass("text-success");
					
					mPasswordInput.setHintText("Sie sind jetzt eingeloggt!");
					mPasswordInput.setHintClass("text-success");
					
					if (settings.onLogin!=undefined)
					{
						settings.onLogin(mSession.email);
					}
					
					setTimeout(function(){//hides itself after 1sec
						fadeOut();
						},1000);
				}else
				{
					console.log("server response:");
					console.log(response);
					
					mEmailInput.setHintText("Email oder Passwort ist nicht korrekt");
					mEmailInput.setHintClass("text-danger");
					
					mPasswordInput.setHintText(response.message);
					mPasswordInput.setHintClass("text-danger");
				}
			});
		}
	}
	
	
	function fadeOut()
	{
		mContainer.fadeOut("slow",function(){mContainer.hide("slow");});		
		mEmailInput.fadeOut();
	}
	
	function hide()
	{
		mContainer.css("display","none");
		mEmailInput.hide();
	}
	
	function show()
	{
		updateHintText();
		mContainer.show("slow");
		mEmailInput.show();
	}
	
	function updateHintText()
	{
		
		mEmailInput.setHint(mHintStates[mHintState]);
		mEmailInput.setHintClass("");
		
		mPasswordInput.setHintText("");
		mPasswordInput.setHintClass("");
	}
	
	function setHintState(aState)
	{
		mHintState=aState;
		updateHintText();
	}
	
	function getSession()
	{
		return mSession;
	}
	
	//sets the session from external, e.g. after registering or re-visiting using localStorage-Data
	function setSession(aEmail,aPassword)
	{
		mSession.loggedin=true;
		mSession.email=aEmail;
		mSession.password=aPassword;
	}
	
	function logout()
	{
		mSession.loggedin=false;
		mSession.email=undefined;
		mSession.password=undefined;
		setHintState("login");
	}
	
	return {
		"hide":hide,
		"fadeOut":fadeOut,
		"show":show,
		"setHintState":setHintState,
		"getSession":getSession,
		"setSession":setSession,
		"logout":logout
	};
}

