var backEventListener = null;

var unregister = function() {
    if ( backEventListener !== null ) {
        document.removeEventListener( 'tizenhwkey', backEventListener );
        backEventListener = null;
        window.tizen.application.getCurrentApplication().exit();
    }
}

//Initialize function
var init = function () {
    // register once
    if ( backEventListener !== null ) {
        return;
    }
    
    // TODO:: Do your initialization job
    console.log("init() called");
    
    var backEvent = function(e) {
        if ( e.keyName == "back" ) {
            try {
                if ( $.mobile.urlHistory.activeIndex <= 0 ) {
                    // if first page, terminate app
                    unregister();
                } else {
                    // move previous page
                    $.mobile.urlHistory.activeIndex -= 1;
                    $.mobile.urlHistory.clearForward();
                    window.history.back();
                }
            } catch( ex ) {
                unregister();
            }
        }
    }
    
    // add eventListener for tizenhwkey (Back Button)
    document.addEventListener( 'tizenhwkey', backEvent );
    backEventListener = backEvent;
    
    $(".updatewidget").click(function(){
    	//手動Update（クエリは効く）
		var appControl = getWidgetUpdateControl("updateType=direct&locale=" + $(this).data("locale"))
		tizen.application.launchAppControl(appControl, "dbox.web-provider");
    });
    
    (function(){
    	tizen.alarm.removeAll();
    	//30秒ごとに自動Update登録（クエリは効かない）
		var appControl = getWidgetUpdateControl("updateType=direct&locale=Osaka,9");//効かない
		var alarm = new tizen.AlarmRelative(0, 29);
	    tizen.alarm.add(alarm, "dbox.web-provider", appControl);
		console.log(alarm.id);
    })();

    function getWidgetUpdateControl(arg){
		var contentInfo = arg || "";
		var appControlData = new tizen.ApplicationControlData("content-info", [contentInfo]);
		var appControl = new tizen.ApplicationControl(
		   "http://tizen.org/appcontrol/operation/dynamicbox/web/update",
		   "box-service://DcW1rMjjnT.WorldClockBox.default",
			   null, null, [appControlData]);
		return appControl;
    }
    
};


$(document).bind( 'pageinit', init );
$(document).unload( unregister );