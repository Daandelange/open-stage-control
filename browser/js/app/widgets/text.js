var utils = require('./utils'),
    mapToScale = utils.mapToScale

module.exports.options = {
    type:'text',
    id:'auto',

    separator1:'style',

    label:'auto',
    left:'auto',
    top:'auto',
    width:'auto',
    height:'auto',
    vertical:false,
    color:'auto',
    css:'',

    separator2:'osc',

    preArgs:[],
    path:'auto',
    defaultText:''
}
module.exports.create = function(widgetData,container) {
    var widget = $(`
            <div class="text">
            </div>
            `),
		label = widgetData.defaultText!==''?
                    widgetData.defaultText:
                    widgetData.label===false?
                        widgetData.id:
                        widgetData.label=='auto'?
                            widgetData.id:
                            widgetData.label


    if (widgetData.vertical) widget.addClass('vertical')

    widget.setValue = function(v,send,sync){
		widget.text(v==='default'?label:v)
    }

    widget.setValue(label)

    return widget
}