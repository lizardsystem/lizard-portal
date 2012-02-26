#
#  base class for edit summary input
#
#  usage:
#    Lizard.window.EditSummaryBox.show(
#        fn: (btn, text, field)  ->
#             if (btn=='ok')
#                 me.store.setTempWriteParams({edit_message: text})
#                 me.saveEdits()
#             return true
#    )
#

Ext.define 'Lizard.window.EditSummaryBox',

    statics:
        show: (config) ->
            a = Ext.create('Ext.window.MessageBox',{
                  btnCallback: (btn) ->
                      if (btn=='ok')
                          msgBox = @

                          field = msgBox.textArea
                          value = field.getValue()
                          if value < 1
                               field.setActiveError('Minimale lengte is 1 letter')
                               return false

                          btn.blur();

                          if msgBox.userCallback(btn.itemId, value, field)
                              msgBox.hide()
                              msgBox.destroy()
            })

            args = Ext.merge({
                title: 'Wijzigingen opslaan',
                msg: 'Samenvatting',
                width: 300,
                multiline: true,
                buttons: Ext.MessageBox.OKCANCEL,
                fn: (btn, text, field)  ->
                     return true
            }, config)

            a.show(args)