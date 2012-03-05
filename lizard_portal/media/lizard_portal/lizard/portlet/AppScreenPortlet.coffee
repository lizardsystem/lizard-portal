# A screen with (user selected) apps.
Ext.define('Lizard.portlet.AppScreenPortlet', {
    # A specialized Ext.panel.Panel
    extend: 'Lizard.portlet.Portlet'
    alias: 'widget.appscreenportlet'
    # config:
    #     context_manager: []


    layout:
        type: 'vboxscroll'
        align: 'stretch'

    defaults:
        flex: 1,
        height: 250

    autoScroll:true
    # tbar: ['Apps:']

    initComponent: () ->
        # me = @
        #console.log('Jack Init portlet')
        #
        # Apply the store to the items
        Ext.apply(@, {
            items: {
                xtype: 'dataview',
                store: @store,
                tpl: new Ext.XTemplate(
                    '<tpl for=".">',
                        '<div class="app_icon draggable"><a href="{url}" title="{description}">',
                                '<img src="/static_media/lizard_portal/app_icons/metingen.png" ',
                                'id="app-{slug}" />',
                                '<div>{name} ({type})</div>',
                        '</a></div>',
                    '</tpl>'
                ),
                itemSelector: 'div.apps-source',
                # /*
                #  * Here is where we "activate" the DataView.
                #  * We have decided that each node with the class "patient-source" encapsulates a single draggable
                #  * object.
                #  *
                #  * So we inject code into the DragZone which, when passed a mousedown event, interrogates
                #  * the event to see if it was within an element with the class "patient-source". If so, we
                #  * return non-null drag data.
                #  *
                #  * Returning non-null drag data indicates that the mousedown event has begun a dragging process.
                #  * The data must contain a property called "ddel" which is a DOM element which provides an image
                #  * of the data being dragged. The actual node clicked on is not dragged, a proxy element is dragged.
                #  * We can insert any other data into the data object, and this will be used by a cooperating DropZone
                #  * to perform the drop operation.
                #  */
                listeners: {
                    render: (v) ->
                        # console.log('Initialize drag')
                        # console.log(v)
                        # Initialize dragzone
                        v.dragZone = Ext.create('Ext.dd.DragZone', v.getEl(), {

                    #      On receipt of a mousedown event, see if it is within a draggable element.
                    #      Return a drag data object if so. The data object can contain arbitrary application
                    #      data, but it should also contain a DOM element in the ddel property to provide
                    #      a proxy to drag.
                            getDragData: (e) ->
                                sourceEl = e.getTarget(v.itemSelector, 10)

                                if (sourceEl)
                                    d = sourceEl.cloneNode(true);
                                    d.id = Ext.id();
                                    return v.dragData = {
                                        sourceEl: sourceEl,
                                        repairXY: Ext.fly(sourceEl).getXY(),
                                        ddel: d,
                                        patientData: v.getRecord(sourceEl).data
                                            }

                    #      Provide coordinates for the proxy to slide back to on failed drag.
                    #      This is the original XY coordinates of the draggable element.
                            getRepairXY: ->
                                return this.dragData.repairXY

                        })
                }
            }
        })

        @callParent(arguments)

})

