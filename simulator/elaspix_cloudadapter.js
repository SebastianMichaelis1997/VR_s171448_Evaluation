/*
 *closure to abstract all cloud communication
 *
 *settings must contain fields:
 *log: a method to show log entries
 *
 *add functionality here to send the status upates to the cloud
 */
function createCloudAdapter(settings)
{
	var mToken_upload_customer="UaeObe4TeZxM7J5sAZESM_7xGvc_";
	var mToken_upload_angel="5INds0dYMMUgqGuYDoPqFLGtdRU_";
	var mCloudBase="https://webtechlecture.appspot.com/cloudstore";
	
	function setEmotionalState(aName,aState)
	{
		var url=mCloudBase+"/get?owner=upload_customer&key="+aName;
		$.getJSON(url,function(response){
			if (response.hasOwnProperty("status") && response.hasOwnProperty=="failed")
			{
				log("could not retrieve data for "+aName);
			}else
			{
				var customerJSON=response;
				customerJSON.state=aState;
				updateCustomer(customerJSON);
			}
			
			});
		
		settings.log(aName+ " is now emotionally "+aState);
	}
	
	function buyUpgrade(aName,aUpgrade,aPrice)
	{
		aPrice=parseFloat(aPrice);
		var url=mCloudBase+"/get?owner=upload_customer&key="+aName;
		$.getJSON(url,function(response){
			if (response.hasOwnProperty("status") && response.hasOwnProperty=="failed")
			{
				log("could not retrieve data for "+aName);
			}else
			{
				var customerJSON=response;
				if (customerJSON.upgrades.length>5)
				{
					customerJSON.spent=0;
					customerJSON.upgrades=[];
					log("clear upgrades for "+aName);
				}else
				{
					customerJSON.spent=customerJSON.spent+aPrice;
					customerJSON.upgrades.push(aUpgrade);	
				}
				
				updateCustomer(customerJSON);
			}
			
			});
		settings.log(aName+ " buys "+aUpgrade+" for "+aPrice+"$");
	}
	
	function move(aName,aX,aY)
	{
		aX=parseInt(aX);
		aY=parseInt(aY);
		
		var url=mCloudBase+"/get?owner=upload_customer&key="+aName;
		$.getJSON(url,function(response){
			if (response.hasOwnProperty("status") && response.hasOwnProperty=="failed")
			{
				log("could not retrieve data for "+aName);
			}else
			{
				var customerJSON=response;
				customerJSON.position.x=aX;
				customerJSON.position.y=aY;
				updateCustomer(customerJSON);
			}
			
			});
		
		settings.log(aName+ " moved to ["+aX+","+aY+"]");
	}
	
	function initAngel(aName,aCustomersJSON)
	{
		
		var applicationName="heaven_angel_control_terminal";
		var seed=getMurmurSeed(applicationName);
		var pwClear="upload";
		var pwHash=murmurhash3_32_gc(encodeURIComponent(applicationName+pwClear),seed);
		console.log("pwhash="+pwHash);
		
		var dataJSON={"name":aName,"pwhash":pwHash,"customers":aCustomersJSON};
		
		var url=mCloudBase+"/add?owner=upload_angel&token="+mToken_upload_angel+"&key="+aName+"&jsonstring="+encodeURIComponent(JSON.stringify(dataJSON));
		
		console.log("url for init Angel:");
		console.log(url);
		$.getJSON(url,function(response){
				log(response);
			});
	}
	
	function initCustomer(aCustomerName,aIconURL)
	{
		var dataJSON={"name":aCustomerName,"state":"happy","spent":0,"room":Math.round(Math.random()*10000),"dateofupload":"15.06.20",
			"position":{"x":250+Math.round(Math.random()*1000),"y":200+Math.round(Math.random()*800)},
			"upgrades":[],
			"iconurl":aIconURL, 
			"creditcard":"Mastercard"
		};
		
		updateCustomer(dataJSON);
	}
	
	function updateCustomer(aCustomerJSON)
	{
		var url=mCloudBase+"/add?owner=upload_customer&token="+mToken_upload_customer+"&key="+aCustomerJSON.name+"&jsonstring="+encodeURIComponent(JSON.stringify(aCustomerJSON));
		
		console.log("url for init customer:");
		console.log(url);
		$.getJSON(url,function(response){
				if (response.status=="ok")
				{
					log("customer update for "+aCustomerJSON.name+" successful");
				}else
				{
					log("customer update fails: "+response);
				}
			});		
	}
	
	//added by TG (elaspix) to generate an application specific seed from a prefix
	function getMurmurSeed(aPrefix)
	{
		
		var sum=0;
		for (var i=0;i<aPrefix.length;i++)
		{
			sum+=aPrefix.charCodeAt(i);
		}
		return sum%32003;//just make sure the seed do not exceeed 32003 to become negative (if its much much larger)
	}
	
	
	return {
		"setEmotionalState":setEmotionalState,
		"buyUpgrade":buyUpgrade,
		"move":move,
		"initAngel":initAngel,
		"initCustomer":initCustomer
	};
}