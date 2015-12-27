Ext.define('datagrep.view.table.DataTableController', {
    requires: [
        'datagrep.view.table.CreateTableWindow',
        'datagrep.view.table.AddColumnWindow'
    ],
    extend: 'Ext.app.ViewController',
    alias: 'controller.datatable',

    listen: {
        controller: {
            '#addcolumnwindow': {
                submitaddcolumn: 'onSubmitAddColumn'
            }
        }
    },

    gridStore: null,
    selectedTableModel: null,

    onCreateTableBtnClick: function() {
        var win = Ext.create('datagrep.view.table.CreateTableWindow');
        win.show();
    },

    onRemoveTableBtnClick: function() {
        var me = this,
            refs = me.getReferences(),
            tableCombobox = refs.tableCombobox;

        if(me.selectedTableModel) {
            Ext.MessageBox.confirm("提示", "确定删除？", function(ok) {
                if(ok === 'yes') {
                    me.selectedTableModel.drop();
                    me.clearTableGrid();
                    tableCombobox.setValue('');
                    me.selectedTableModel = null;
                    me.gridStore = null;
                }
            });
        }
    },

    onAddColumnBtnClick: function() {
        var win = Ext.create('datagrep.view.table.AddColumnWindow');
        win.show();
    },

    onAddRowBtnClick: function() {
        if(this.gridStore) {
            this.gridStore.add({});
        }
    },

    onTableSelectionChange: function(combo, model) {
        this.selectedTableModel = model;
        this.updateTableGrid(model);
    },

    onSubmitAddColumn: function(data) {
        var me = this,
            refs = me.getReferences(),
            tableCombobox = refs.tableCombobox,
            columnName = data.columnName,
            columnType = data.columnType,
            columnDisplayName = data.columnDisplayName;

        if(me.selectedTableModel) {
            me.selectedTableModel.addColumn({
                text: columnDisplayName || columnName,
                columnType: columnType,
                dataIndex: columnName
            });
            me.updateTableGrid(me.selectedTableModel);
        }
    },

    onSaveBtnClick: function() {
        if(this.gridStore) {
            this.gridStore.save({
                params: {
                    table: this.selectedTableModel.get('tableName')
                }
            });
        }
    },

    clearTableGrid: function() {
        var me = this,
            refs = me.getReferences(),
            tableGrid = refs.tableGrid;
        tableGrid.reconfigure(Ext.create('Ext.data.Store'), []);
    },

    updateTableGrid: function(model) {
        var me = this,
            refs = me.getReferences(),
            tableGrid = refs.tableGrid,
            columns = model.getColumns();

        var editorsStore = me.getViewModel().get('Editors');
        var fields = [];
        columns.forEach(function(column) {
            fields.push({
                name: column.dataIndex
            });
        });
        var store = Ext.create('datagrep.view.table.store.SingleTable', {
            fields: fields
        });
        columns = JSON.parse(JSON.stringify(columns));
        columns.forEach(function(column) {
            column.editor = editorsStore.createEditor(column.columnType);
        });
        columns.unshift({
            xtype: 'rownumberer'
        });
        columns.push({
            menuDisabled: true,
            sortable: false,
            xtype: 'actioncolumn',
            width: 50,
            items: [{
                iconCls: 'cell-editing-delete-row',
                tooltip: '删除此行',
                handler: function(grid, rowIndex, colIndex) {
                    var rec = grid.getStore().getAt(rowIndex);
                    rec.drop();
                }
            }]
        });
        columns.push({
            text: '',
            flex: 1,
            disabled: true
        });
        tableGrid.reconfigure(store, columns);
        store.load({
            params: {
                table: me.selectedTableModel.get('tableName')
            }
        });
        if(me.gridStore) {
            me.gridStore.each(function(record) {
                store.add(record);
            });
        }
        me.gridStore = store;
    }
});

Ext.define('datagrep.view.table.store.SingleTable', {
    extend: 'Ext.data.Store',
    alias: 'store.singletable',
    proxy: {
        type: 'ajax',
        api: {
            create: '/datatable/saveTable',
            read: '/datatable/loadTable'
        },
        reader: {
            type: 'json',
            successProperty: 'success',
            rootProperty: 'data'
        },
        writer: {
            type: 'json',
            successProperty: 'success',
            rootProperty: 'data',
            writeAllFields: true
        }
    },
    getNewRecords: function() {
        return this.getDataSource().items.slice(0);
    },
    getRemovedRecords: function() {
        return [];
    },
    getUpdatedRecords: function() {
        return [];
    }
});
