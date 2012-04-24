
{
    xtype: 'form',
    // Fields will be arranged vertically, stretched to full width
    layout: 'anchor',
    autoScroll: true,
    height: '100%',
    defaults: {
        anchor: '95%',
        margin: '10px'
    },
    items:[
        {
            fieldLabel: 'Titel',
            name: 'title',
            xtype: 'textfield',
            allowBlank: false
        },
        {
            fieldLabel: 'Categorie',
            name: 'category',
            store: ['waterkwaliteit', 'ecologie', 'kwantiteit', 'grondwater', 'algemeen'],
            xtype: 'combo',
            multiSelect: true,
            forceSelection: true,
            allowBlank: false
        },
        {
            fieldLabel: 'Status',
            name: 'status',
            store: ['in bewerking', 'concept', 'definitief'],
            xtype: 'combo',
            forceSelection: true,
            allowBlank: false
        },
        {
            xtype: 'fieldcontainer',
            layout: 'hbox',
            defaults: {
                flex: 1
            },
            items: [
            {
                fieldLabel: 'Begin periode/ tijdstip',
                name: 'date_period_start',
                xtype: 'datefield'
            },
            {
                fieldLabel: 'Eind periode (optioneel)',
                name: 'date_period_end',
                xtype: 'datefield'
            }]
        },
        {
            name: 'time_period_start',
            xtype: 'hiddenfield',
            value: '00:00:00'
        },
        {
            name: 'time_period_end',
            xtype: 'hiddenfield',
            value: '00:00:00'
        },
        {
            fieldLabel: 'Omschrijving',
            name:'description',
            xtype: 'htmleditor',
            height: 300
            //resizable: true
        },
        {
            name: 'annotation_type',
            xtype: 'hiddenfield',
            value: 'analyse_interpretatie'
        },
        {
            name: 'reference_objects',
            xtype: 'hiddenfield',
            value: '{}'
        },
        {
            name: 'created_by',
            xtype: 'hiddenfield',
            value: Ext.getCmp('portalWindow').context_manager.getContext().user.name
        },
        {
            xtype:'fieldset',
            checkboxToggle:true,
            title: 'Link naar aan/afvoergebied en/of KRW-waterlichaam',
            collapsed: false,
            layout: 'anchor',
            defaults: {
                anchor: '100%'
            },
            items :[
            {
                xtype: 'combomultiselect',
                fieldLabel: 'aan/ afvoer gebieden',
                name: 'aan_afvoergebied',
                field_name: 'aan/ afvoer gebieden',
                read_at_once: false,
                combo_store: {
                    fields: [
                        {name: 'id', mapping: 'id' },
                        {name: 'name', mapping: 'name' }
                    ],
                    proxy: {
                        type: 'ajax',
                        url: '/area/api/catchment-areas/?node=root&_accept=application%2Fjson&id=id',
                        reader: {
                            type: 'json',
                            root: 'areas'
                        }
                    }
                }
            }, {
                xtype: 'combomultiselect',
                fieldLabel: 'KRW waterlichamen',
                name: 'krw_waterlichaam',
                field_name: 'KRW waterlichamen',
                read_at_once: false,
                combo_store: {
                    fields: [
                        {name: 'id', mapping: 'id' },
                        {name: 'name', mapping: 'name' }
                    ],
                    proxy: {
                        type: 'ajax',
                        url: '/area/api/krw-areas/?node=root&_accept=application%2Fjson&id=id',
                        reader: {
                            type: 'json',
                            root: 'areas'
                        }
                    }
                }
            }]

        },
        {
            xtype: 'fieldcontainer',
            layout: 'hbox',
            defaults: {
                flex: 1
            },
            items: [
                {
                    fieldLabel: 'x',
                    name: 'x',
                    xtype: 'numberfield'
                },
                {
                    fieldLabel: 'y',
                    name: 'y',
                    xtype: 'numberfield'
                }
            ]
        }
/*
        {
            fieldLabel: 'KRW waterlichamen',
            name: 'krw_waterlichamen',
            //autoHeight: true,
            height: 100,
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [{
                flex: 1,
                store: {
                    fields: [
                        {
                            name: 'id'

                        },{
                            name: 'text'
                        }
                    ]
                },
                xtype: 'gridpanel',
                columns: [{
                    text: 'Gebieden',
                    dataIndex: 'text',
                    flex:1,
                    minHeight: '100px'
                }],

                viewConfig: {
                    plugins: {
                        minHeight: '100px',
                        ptype: 'gridviewdragdrop',
                        dropGroup: 'firstGridDDGroup'
                    }
                }
            }, {
                flex: 1,
                store: {
                    fields: [
                        {
                            name: 'id'

                        },{
                            name: 'text'
                        }
                    ]
                },
                xtype: 'gridpanel',
                columns: [{
                    text: 'Gebieden',
                    dataIndex: 'text',
                    flex:1
                }],
                viewConfig: {
                    plugins: {
                        minHeight: '100px',
                        ptype: 'gridviewdragdrop',
                        dropGroup: 'firstGridDDGroup'
                    }
                }
            }]
        },

        {
            fieldLabel: 'kunstwerken (nog geen koppeling)',
            name: 'kunstwerken',
            xtype: 'textfield'
        },
        {
            fieldLabel: '(deel) maatregelen (nog geen koppeling)',
            name: 'maatregelen',
            xtype: 'textfield'
        },
        {
            fieldLabel: 'workspaces (nog geen koppeling)',
            name: 'maatregelen',
            xtype: 'textfield'
        },
        {
            fieldLabel: 'collage (nog geen koppeling)',
            name: 'maatregelen',
            xtype: 'textfield'
        }*/
    ],
    buttons: [
    {
        text: 'Annuleren',
        handler: function() {
            this.up('window').close();
        }
    },
    {
        text: 'Reset',
        handler: function() {
            this.up('form').getForm().reset();
        }
    }, {
        text: 'Opslaan',
        //formBind: true, //only enabled once the form is valid
        //disabled: true,
        handler: function() {
            var form = this.up('form').getForm();
            var form_window = this.up('window')
            if (form.isValid()) {
                /* todo: de waarden zelf gaan rangschikken en verzenden */
                var values = form.getValues()
                console.log(values);

                var ref_objecs = {}
                var gebieden = Ext.JSON.decode(values.aan_afvoergebied)

                for (var nr in gebieden) {
                   ref_objecs[nr] = {
                        reference_id: ""+gebieden[nr].id,
                        reference_model: 'lizard_area.models.Area'

                    }
                }

                var gebieden = Ext.JSON.decode(values.krw_waterlichaam)

                for (var nr in gebieden) {

                    ref_objecs[nr] = {
                         reference_id: ""+gebieden[nr].id,
                         reference_model: 'lizard_area.models.Area'

                     }
                }

                var post = {
                    annotation_type: "analyse_interpretatie",
                    status: values.status,
                    category: values.category,
                    created_by: values.created_by,
                    date_period_end: values.date_period_end,
                    date_period_start: values.date_period_start,
                    description: values.description,
                    time_period_end: values.time_period_end,
                    time_period_start: values.time_period_start,
                    title: values.title,
                    reference_objects: Ext.JSON.encode(ref_objecs),
                    _method: 'post'

                }


                 Ext.Ajax.request({
                    url: '/annotation/api/annotation/',
                    params: post,
                    method: 'POST',
                    success: function(xhr) {
                        var store = Ext.StoreManager.lookup('analyse_store')
                        store.load();
                    },
                    failure: function(xhr) {
                        Ext.Msg.alert("portal creation failed", "Server communication failure");
                    }
                });

            }
        }
    }]
}

/*
    Indien de Analist zowel een x-/y-coordinaat invoert als een relatie met een geo-object legt, geeft het Systeem de melding dat dit niet is toegestaan.
*/

/*
    Initieel gegevens inladen t.b.v.bewerken

*/

/*

Definitieve analyse interpretatie
Indien het Systeem constateert dat de geselecteerde analyse interpretatie de status definitief heeft, dan volgt er hiervan een melding en biedt het Systeem de mogelijkheid om een nieuwe instantie van de analyses interpretatie op te slaan. Wanneer de de Analist hiervoor kiest, kan deze nieuwe instantie worden bewerkt overeenkomstig stap 15.
     
*/

/*

    	Analyse interpretatie van iemand anders
Indien het Systeem constateert dat de geselecteerde analyse interpretatie de status concept of in bewerkiing heeft, EN deze is opgevoerd door een andere gebruiker dan de Analist zelf, dan volgt er de waarschuwing waarin de status, gebruiker en laatste wijzigingsdatum-tijd is opgenomen, waarna de Analist de keuze heeft om te annuleren of door te gaan. Indien de Analist besluit om door te gaan kan deze de bewerking uitvoeren overeenkomstig stap 15.


*/