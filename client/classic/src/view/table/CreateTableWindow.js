Ext.define('datagrep.view.table.CreateTableWindow', {
    extend: 'Ext.window.Window',
    xtype: 'createtable-window',

    controller: 'createtablewindow',
    viewModel: {
        type: 'createtablewindow'
    },

    layout: 'fit',
    title: '新建表格',
    modal: true,
    scrollable: true,
    bodyPadding: 10,
    constrain: true,
    closable: true,

    items: [{
        xtype: 'form',
        width: 400,
        layout: 'form',
        reference: 'createTableForm',

        items: [{
            xtype: 'textfield',
            name: 'tableName',
            fieldLabel: '表格名称',
            value: ''
        }]
    }],

    initComponent: function() {
        var me = this;

        me.buttons = [{
            itemId: 'sureBtn',
            text: '确定',
            handler: 'onCreateTableOkBtnClick'
        }, {
            text: '取消',
            handler: function() {
                me.close();
            }
        }];

        me.callParent();
    }

});
