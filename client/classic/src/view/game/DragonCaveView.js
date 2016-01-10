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
                    html: '<iframe id="dragonCaveIframe" style="width: 320px; height: 480px;" src="game/undefined/game.html">'
                }
            }]
        }];

        me.callParent();
    }
});
