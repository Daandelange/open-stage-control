var {widgetManager} = require('./managers'),
    ipc = require('./ipc')

var Osc = function(){

    this.syncOnly = false
    this.remoteExec = ()=>{console.error('remote-exec module not loaded')}

}

Osc.prototype.init = function(data) {
    this.remoteExec = require('./remote-exec')
}

Osc.prototype.send = function(data) {

    if (this.syncOnly) {

        ipc.send('syncOsc', data)

    } else {

        ipc.send('sendOsc', data)

    }

}

Osc.prototype.receive = function(data){

    if (data.address == '/EXEC') return this.remoteExec(data.args)

    // fetch ids corresponding to the osc address
    var address = data.address,
        addressref = address,
        args = data.args,
        target = data.target

    if (typeof data.args == 'object') {
        for (var i=data.args.length-1;i>=0;i--) {

            var ref = widgetManager.createAddressRef({
                        widgetData: {
                            preArgs: data.args.slice(0,i),
                            address: address
                        }
                    })

            if (widgetManager.getWidgetByAddress(ref).length) {
                addressref = ref
                args = data.args.slice(i,data.args.length)
                break
            }

        }
    } else {
        args = data.args
    }


    if (args.length==0) args = null
    else if (args.length==1) args = args[0]


    let widget = widgetManager.getWidgetByAddress(addressref)

    for (i in widget) {
        // if the message target is provided (when message comes from another client connected to the same server)
        // then we only update the widgets that have the same target
        // compare arrays using > and < operators (both false = equality)
        if (!target || !(widget[i].widgetData.target < target || widget[i].widgetData.target > target)) {
            // update matching widgets
            if (widget[i] && widget[i].setValue) widget[i].setValue(args,{send:false,sync:true,fromExternal:!target})
        }
    }

}

var osc = new Osc()

module.exports = osc
