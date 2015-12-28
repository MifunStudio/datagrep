/**
 * Demonstrates a simple toolbar. Some of the buttons have menus attached.
 */
Ext.define('datagrep.view.table.DataTable', {
    requires: [
        'Ext.grid.RowNumberer',
        'Ext.grid.plugin.CellEditing',
        'datagrep.view.table.CreateTableWindow',
        'datagrep.view.table.AddColumnWindow'
    ],
    extend: 'Ext.panel.Panel',
    xtype: 'datagrep-datatable',

    controller: 'datatable',
    viewModel: {
        type: 'datatable'
    },

    layout: {
        type: 'card',
        anchor: '100%'
    },

    initComponent: function() {
        var me = this;

        me.tbar = [{
            xtype: 'combobox',
            reference: 'tableCombobox',
            publishes: 'value',
            fieldLabel: '表格',
            displayField: 'tableName',
            labelWidth: 30,
            editable: false,
            store: {
                type: 'datatable'
            },
            minChars: 0,
            listeners: {
                select: 'onTableSelectionChange'
            }
        }, {
            iconCls: 'right-icon new-icon x-fa fa-file',
            text:'新建表格',
            handler: 'onCreateTableBtnClick'
        }, {
            iconCls: 'right-icon new-icon x-fa fa-file',
            text:'删除表格',
            handler: 'onRemoveTableBtnClick'
        }, '-', {
            iconCls: 'right-icon new-icon x-fa fa-file',
            text: '添加列',
            handler: 'onAddColumnBtnClick'
        }, {
            iconCls: 'right-icon new-icon x-fa fa-file',
            text: '添加行',
            handler: 'onAddRowBtnClick'
        }, {
            iconCls: 'right-icon new-icon x-fa fa-file',
            text: '保存表格',
            handler: 'onSaveBtnClick'
        }];

        me.cellEditing = new Ext.grid.plugin.CellEditing({
            clicksToEdit: 2
        });

        me.items = [{
            xtype: 'grid',
            reference: 'tableGrid',
            flex: 1,
            bodyBorder: true,
            headerBorder: true,
            frame: true,
            title: '',
            columnLines: true,
            cls: 'datagrep-datatable-grid',
            plugins: [ me.cellEditing ]
        }];

        me.callParent();
    }
});
