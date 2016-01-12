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
            fieldLabel: '游戏地址',
            labelWidth: 60,
            xtype: 'textfield',
            itemId: 'gameLink',
            width: 400
        }, {
            iconCls: 'right-icon new-icon x-fa fa-file',
            text:'刷新',
            listeners: {
                click: function() {
                    var link = me.down('#gameLink').getValue();
                    link = link || "game/undefined/game.html";
                    Ext.get('dragonCaveIframe').set({
                        src: link + '&ds=' + 'http://localhost:3000/datatable/loadTable' + '&t=' + Date.now()
                    });
                }
            }
        }, {
            xtype: 'tbspacer',
            flex: 1
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
                    html: '<iframe id="dragonCaveIframe" style="transform-origin: 50% 50%; transform: scale(1.5,1.5); box-shadow: 0 0 5px #000; width: 320px; height: 480px;" src="game/undefined/game.html">'
                }
            }]
        }];

        me.callParent();
    }
});
