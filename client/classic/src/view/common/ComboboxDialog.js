Ext.define('datagrep.view.common.ComboboxDialog', {
    extend: 'Ext.window.Window',
    xtype: 'combobox-dialog',

    layout: 'fit',
    title: '请选择',
    modal: true,
    scrollable: true,
    bodyPadding: 10,
    constrain: true,
    closable: true,

    initComponent: function() {
        var me = this;

        var buttons = [];
        me.dataItems.forEach(function(text) {
            buttons.push({
                xtype: 'button',
                textAlign: 'left',
                text: text,
                width: 200,
                margin: 10,
                handler: function() {
                    me.close();
                    me.okCallback && me.okCallback(text);
                }
            });
        });

        me.items = [{
            xtype: 'container',
            bodyPadding: 20,
            width: 400,
            layout: {
               type: 'vbox',
               pack: 'start',
               align: 'stretch'
           },
            items: buttons
        }];

        me.callParent();
    },

    showDialog: function(callback) {
        this.okCallback = callback;
        this.show();
    }

});
