
# short term solution for working with comboboxes in editable grids
# idea behind solution:
# in the grids has object representation with an id and name (id as real link, name for displaying)
#    at the beginning of editing, only the id is provided (as expected by the editor).
# after editing, not only the id, but also the name is returned for displaying in the grid.
#
# problems: up to now no problems are experienced, only the solution is mwa
#
# issues:
#  - check 'dirty' only based on id
#  - array solution is buggy. Als je op de enter drukt wordt er niet goed opgeslagen.
#  - werkt niet goed bij de initialisatie in geval van een remote store en forceSelection = True
#
#
#


Ext.define('Lizard.grid.GridComboBox', {
    extend: 'Ext.form.field.ComboBox'
    alias: 'widget.gridcombobox'

    initComponent: () ->
        @raw_object = null
        @callParent(arguments)

    setValue: (value) ->
        if Ext.type(value) == 'object'

            if value.id and value.name
                #object from grid
                value = value.id
            else
                #object from editor
                @raw_object = value.raw

        if Ext.type(value) == 'array'

            if value.length > 0 and value[0].name
                output = []
                for val in value
                    output.push(val.id)
                value = output
            else
                output = []
                for rec in value
                    output.push(rec.raw)
                @raw_object = output

        output =  @callParent(arguments)

        console.log('-------------------')
        console.log('setValue')
        console.log('editor:')
        console.log(@)
        console.log('arguments:')
        console.log(arguments)
        console.log('output:')
        console.log(output)
        console.log('this.value:')
        console.log(@value)
        console.log('this.getRawValue():')
        console.log(@getRawValue())
        console.log('this.getDisplayValue():')
        console.log(@getDisplayValue())
        console.log('-------------------')

        return output

    getValue: () ->
        output = @callParent(arguments)

        output = @raw_object

        console.log('-------------------')
        console.log('getValue')
        console.log('editor:')
        console.log(@)
        console.log('arguments:')
        console.log(arguments)
        console.log('output:')
        console.log(output)
        console.log('this.value:')
        console.log(@value)
        console.log('this.getRawValue():')
        console.log(@getRawValue())
        console.log('this.getDisplayValue():')
        console.log(@getDisplayValue())
        console.log('-------------------')

        return output
})
