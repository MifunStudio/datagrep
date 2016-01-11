Ext.define('datagrep.view.game.DragonCaveView', {
    requires: [
    ],
    extend: 'Ext.panel.Panel',
    xtype: 'datagrep-dragonCaveView',

    layout: {
        type: 'card',
        anchor: '100%'
    },

    initComponent: function() {
        var me = this;

        me.tbar = [{
            iconCls: 'right-icon new-icon x-fa fa-file',
            text:'刷新',
            listeners: {
                click: function() {
                    Ext.get('dragonCaveIframe').set({
                        src: "game/undefined/game.html?" + Date.now()
                    });
                }
            }
        }, {
            xtype: 'combobox',
            fieldLabel: '缩放',
            labelWidth: 30,
            width: 120,
            store: Ext.create('Ext.data.Store', {
                fields: [{ name: 'scale', type: 'number'}],
                data: [
                    { scale: 0.5 },
                    { scale: 0.6 },
                    { scale: 0.7 },
                    { scale: 0.75 },
                    { scale: 0.8 },
                    { scale: 0.85 },
                    { scale: 1.0 },
                ]
            }),
            queryMode: 'local',
            displayField: 'scale',
            valueField: 'scale',
            editable: false,
            value: 0.75,
            listeners: {
                change: function(slider, newVal) {
                    var scale = newVal * 2;
                    document.getElementById('dragonCaveIframe').style.transform = 'scale(' + scale + ',' + scale + ')';
                }
            }
        }];

        me.items = [{
            xtype: 'container',
            layout: 'center',
            items: [{
                width: 320,
                height: 480,
                xtype: 'container',
                layout : 'fit',
                autoEl : {
                    html: '<iframe id="dragonCaveIframe" style="transform-origin: 50% 50%; transform: scale(0.75,0.75); box-shadow: 0 0 5px #000; width: 320px; height: 480px;" src="game/undefined/game.html">'
                }
            }]
        }];

        me.callParent();
    }
});
