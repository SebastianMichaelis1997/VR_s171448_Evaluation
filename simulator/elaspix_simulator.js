/*
 *closure to simulate Heaven Customers
 *settings requires filds
 *col1: jQeryDiv of first column
 *col2: jQeryDiv of second column
 *log: function to show log entries
 */

function createSimulator(settings)
{
	var mMap;
	var mCustomer;
	var mEmotion;
	var mUpgrade;
	var mAutoSwitch;
	var mCustomerList;
	var mUpgradeList;
	var mEmtionList;
	var mCloudAdapter;
	
	setup();
	
	function setup()
	{
		$("#button-init-angel").click(initAngel);
		$("#button-init-customers").click(initCustomer);
		
		mAutoSwitch=createSwitch({"parent":settings.col1,"id":"autogenerate","title":"Auto Mode","oncheckboxclick":onAutoCheckboxClicked,
								 "isclicked":"auto","notclicked":"off"});
		
		mCustomerList=["Nathon Brown","Byron","Luke","Aleesha","Ingrid Kannerman","Lucy"];
		mMap=createVRMap({"parent":settings.col2,"isDraggable":true,"onMove":onMove});
		mCustomer=createDropdowndesktop({"id":"dropdown-customers","labelText":"Customer","titleText":mCustomerList[0],
										 "listValues":mCustomerList,
										 "width":"100%","onChange":onCustomerChange,
										 "parent":settings.col1});
		mEmtionList=["happy","angry","lonely","frightened","cool","surprised"];
		mEmotion=createDropdowndesktop({"id":"dropdown-emotions","labelText":"Emotional State","titleText":mEmtionList[0],
										 "listValues":mEmtionList,
										 "width":"100%","onChange":onEmotionChange,
										 "parent":settings.col1});
		
		mUpgradeList=["Rennferd 1500$","Golfschläger-gold 2000$","Premium-Frühstück 200$","Sportlook 5000$"];//<name><space><price>$
		mUpgrade=createDropdowndesktop({"id":"dropdown-upgrades","labelText":"Upgrade","titleText":mUpgradeList[0],
										 "listValues":mUpgradeList,
										 "width":"100%","onChange":onUpgradeChange,
										 "parent":settings.col1});
		
		for (var i=0;i<mCustomerList.length;i++)
		{
			var customerName=mCustomerList[i];
			var x=Math.round(Math.random()*1547);
			var y=Math.round(Math.random()*1238);
			
			mMap.addPin(customerName,x,y);
		}
		
		mCloudAdapter=createCloudAdapter({"log":settings.log});
		
		mMap.centerMap(mCustomerList[0]);
	}
	
	function initAngel()
	{
		mCloudAdapter.initAngel("Nora Antony",mCustomerList);
	}
	
	function initCustomer()
	{
		
		var icons=["pics/pixabay/man1.jpg","pics/pixabay/man2.jpg","pics/pixabay/man3.jpg",
				   "pics/pixabay/woman1.jpg","pics/pixabay/woman2.jpg","pics/pixabay/woman3.jpg"];
		var nr=6;
		mCloudAdapter.initCustomer(mCustomerList[nr],icons[nr]);
	}
	
	function onMove(aName,aX,aY)
	{
		if (mAutoSwitch.getValue()=="auto")
		{
			mCloudAdapter.move(aName,Math.round(aX),Math.round(aY));
		}
	}
	
	
	function onAutoCheckboxClicked(aValue)
	{
		//console.log("switched to" +aValue);
		log("switch Mode to "+aValue);
		if (aValue=="auto")
		{
			simulate();
		}
		
	}
	
	function onCustomerChange(aCustomerSelected)
	{
		//console.log("selected customer is "+aCustomerSelected);
		mMap.centerMap(aCustomerSelected);
	}
	
	function onEmotionChange(aEmotion)
	{
		//console.log("selected emotion is "+aEmotion);
		var name=mCustomer.getValue();
		mCloudAdapter.setEmotionalState(name,aEmotion);
		
	}
	
	function onUpgradeChange(aUpgrade)
	{
		//console.log("selected upgrade is "+aUpgrade);
		var name=mCustomer.getValue();
		upgrade2CloudAdapter(name,aUpgrade);
	}
	
	function upgrade2CloudAdapter(aName,aUpgrade)
	{
		var upgradeName=aUpgrade.split(" ")[0];
		var price=(aUpgrade.split(" ")[1]).slice(0,-1);//remove the $ sign at the end		
		mCloudAdapter.buyUpgrade(aName,upgradeName,price);
	}
	
	function simulate()
	{
		var name= randomEntry(mCustomerList);
		log("random name="+name);
		var whatToChange=Math.floor(Math.random()*3);
		switch (whatToChange)
		{
			case 0:
				var emotion=randomEntry(mEmtionList);
				mCloudAdapter.setEmotionalState(name,emotion);
				break;
				
			case 1:
				var upgrade=randomEntry(mUpgradeList);
				upgrade2CloudAdapter(name,upgrade);
				break;
			
			case 2:
				var x=Math.round(Math.random()*1547);
				var y=Math.round(Math.random()*1238);
				mMap.setTarget(name,x,y);
			break;
		}
		
		if (mAutoSwitch.getValue()=="auto")
		{
			setTimeout(simulate,2000);
		}
	}
	
	function randomEntry(aList)
	{
		var index=Math.floor(Math.random()*aList.length);		
		return aList[index];
	}
	
	
	

	
	return {
		
	};
}