/*
 *closure to manage a map-pin
 *
 *settings must contain
 *	parent: the parent of the pin
 *	name: the name of the pin
 *	pos: the position of the pin in px [0..maxWidth] as field with x and y
 *	shiftMap: an JSON-Object with x,y of the shifted map (used for scrolling)
 *	onClick: method to be called if the pin was clicked (show open detail dialoge)
 *	onMove: method to be called if new significant position was reached
 *	isDraggable: if true, the pin can be dragged to define a new target position (used for the simulator)
 */
function createPin(settings)
{
	var mContainer;
	var mImg;
	var mName;
	var mTarget={"x":50,"y":50};// in px
	var mPos={"x":50,"y":50};//in px
	var mLastSendPos={"x":50,"y":50};//stores the position that was reported to report only significant motions
	var mDragging={"x_px":50,"y_px":50,"isDragging":false};
	
	inflate();
	setup();
	setupCSS();
	
	function inflate()
	{
		mContainer=$("<div/>").attr("id","pin-"+settings.name);
		mName=$("<div/>").text(settings.name).addClass("pin-text");
		
		mImg=$("<img/>").attr("src","pics/map-pin.svg");
		mContainer.append(mImg);
		mContainer.append(mName);
		settings.parent.append(mContainer);
		
	}
	
	function setup()
	{
		mTarget.x=settings.pos.x;
		mTarget.y=settings.pos.y;
		mPos.x=settings.pos.x;
		mPos.y=settings.pos.y;
		mLastSendPos.x=settings.pos.x;
		mLastSendPos.y=settings.pos.y;
		
		if (settings.isDraggable==true)
		{
			mContainer.on("mousedown",onMouseDown);//just make sure the parent-div (the wrapper) does not receive the event during drag'n drop
			mContainer.on("mouseup",onMouseUp);//just make sure the parent-div (the wrapper) does not receive the event during drag'n drop
			mContainer.on("mousemove",onMouseMove);//just make sure the parent-div (the wrapper) does not receive the event during drag'n drop
			mContainer.on("dragstart",onDragStart);
		}
		mContainer.on("click touchstart",onClick);
		
	}
	
	function setupCSS()
	{
		mContainer.css("position","absolute");
		mContainer.css("left",settings.pos.x+"px");
		mContainer.css("top",settings.pos.y+"px");
		mContainer.css("text-align","center");
		if (settings.isDraggable)
		{
			mContainer.css("cursor","crosshair");
			mContainer.attr("draggable","true");//this container can be dragged
		}else
		{
			mContainer.css("cursor","pointer");
		}
		mContainer.css("transition","left 1s, top 1s");
		
		
		mImg.attr("draggable","false");
		mImg.css("pointer-events","none");//do not drag the image alone
		
		
	}
	
	function onClick()
	{
		if (settings.onClick!=undefined)
		{
			settings.onClick(settings.name);
		}
	}
	
	
	function onDragStart(event)
	{
		console.log("onDragStart");
		console.log(event);
		event.originalEvent.dataTransfer.setData("text",event.target.id);
		mDragging.x_px=event.clientX;
		mDragging.y_px=event.clientY;
		mDragging.isDragging=true;
	}
	
	//a drop happed for this Pin
	function onDrop(aX_px,aY_px)
	{
		if (mDragging.isDragging)
		{
			
			var dx=aX_px-mDragging.x_px;
			var dy=aY_px-mDragging.y_px;
			setTarget(mPos.x+dx,mPos.y+dy);
			mDragging.isDragging=false;
		}
	}
	
	function onMouseMove(event)
	{
		event.stopPropagation();
	}
	
	function onMouseDown(event)
	{
		event.stopPropagation();
	}
	
	function onMouseUp(event)
	{
		event.stopPropagation();
	}
	
	
	
	//shows the pins to its internal position considering shiftMap-Cutoff
	function updatePos()
	{
		mContainer.css("left",(mPos.x+settings.shiftMap.x_px)+"px");
		mContainer.css("top",(mPos.y+settings.shiftMap.y_px)+"px");
	}
	
	//does the simulated movement
	function move()
	{
		if (mDragging.isDragging==false)
		 {
			var dx=mTarget.x-mPos.x;
			var dy=mTarget.y-mPos.y;
			//console.log(dx+" "+dy);
			
			var vectorLength=Math.sqrt(dx*dx+dy*dy);
			
			if (vectorLength>5)
			{
				//normalize to equal speed
				var speed=5;//5 pixel per update --> 10 pixel per second
				dx=(dx/vectorLength)*speed;
				dy=(dy/vectorLength)*speed;
			}
			
			mPos.x=mPos.x+dx;
			mPos.y=mPos.y+dy;
			
			dx=mLastSendPos.x-mPos.x;
			dy=mLastSendPos.y-mPos.y;
			var dist=Math.sqrt(dx*dx+dy*dy);
			if (dist>100)
			{
				mLastSendPos.x=mPos.x;
				mLastSendPos.y=mPos.y;
				if (settings.onMove!=undefined)
				{
					settings.onMove(settings.name,mPos.x,mPos.y);
				}
			}
			updatePos();
		 }
	}
	
	function setPos(aX,aY)
	{
		mPos.x=aX;
		mPos.y=aY;
		updatePos();
	}
	
	
	
	
	
	function setTarget(aX,aY)
	{
		mTarget.x=aX;
		mTarget.y=aY;
		console.log("target set to");
		console.log(mTarget);
	}
	
	function getPos()
	{
		return {"x":mPos.x,"y":mPos.y};
	}
	
	function setSmoothTransition(aIsSmoothTransition)
	{
		if (aIsSmoothTransition)
		{
			mContainer.css("transition","left 1s, top 1s");
		}else
		{
			mContainer.css("transition","");
		}
	}
	
	
	
	return {
		"setPos":setPos,
		"setTarget":setTarget,
		"move":move,
		"updatePos":updatePos,
		"getPos":getPos,
		"setSmoothTransition":setSmoothTransition,
		"onDrop":onDrop
		
	};
}