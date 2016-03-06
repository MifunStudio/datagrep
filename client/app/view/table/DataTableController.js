Ext.define('datagrep.view.table.DataTableController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.datatable',
    requires: [
        'datagrep.Constants'
    ],
    listen: {
        controller: {
            '#addcolumnwindow': {
                submitaddcolumn: 'onSubmitAddColumn'
            },
            '#createtablewindow': {
                createtable: 'onCreateTable'
            }
        }
    },

    gridStore: null,
    selectedTableModel: null,

    onCreateTableBtnClick: function() {
        var win = Ext.create('datagrep.view.table.CreateTableWindow');
        win.show();
    },

    onCreateTable: function() {
        var me = this,
            refs = me.getReferences(),
            tableCombobox = refs.tableCombobox;

        tableCombobox.store.sync();
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
                },
                success: function() {
                    Ext.toast({
                        html: '保存成功',
                        align: 't'
                    });
                },
                failure: function() {
                    Ext.MessageBox.show({
                        title: '错误',
                        msg: '保存失败了!',
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.ERROR
                    });
                }
            });
        }
    },

    onSelectExcelBtnClick: function() {
        var me = this;
        if(!me.gridStore) {
            Ext.toast({
                html: '请选择一个表格',
                align: 't'
            });
            return;
        }
        var fileInput = document.getElementById('excelFileInput');
        fileInput.addEventListener('change', function onChange(e) {
            fileInput.removeEventListener('change', onChange);
            var files = e.target.files;
            if(files && files[0]) {
                Ext.MessageBox.show({
                    msg: '读取数据中...',
                    progressText: 'reading...',
                    width: 500,
                    wait: {
                        interval: 200
                    }
                });
                var reader = new FileReader();
                reader.onload = function(e) {
                    fileInput.value = '';
                    var data = e.target.result;
                    var workbook = XLSX.read(data, {type: 'binary'});
                    Ext.MessageBox.hide();

                    var dialog = Ext.create('datagrep.view.common.ComboboxDialog', {
                        title: '请选择数据表格',
                        dataItems: workbook.SheetNames.slice(0)
                    });
                    dialog.showDialog(function(sheetName) {
                        var worksheet = workbook.Sheets[sheetName];
                        var array = XLSX.utils.sheet_to_json(worksheet);
                        var startLine = 0;
                        for(var i=0; i<array.length; i++) {
                            var obj = array[i];
                            var isStart = false;
                            var colCount = 0;
                            for(var key in obj) {
                                if(obj[key]) {
                                    colCount++;
                                }
                                if(obj[key].toLowerCase() === 'start') {
                                    isStart = true;
                                }
                            }
                            if(isStart && colCount) {
                                startLine = i + 1;
                                break;
                            }
                        }
                        me.gridStore.removeAll();
                        me.gridStore.add(array.slice(startLine));
                    });
                };
                reader.readAsBinaryString(files[0]);
            }
        });
        fileInput.click();
    },

    onUploadBtnClick: function() {
        Ext.Ajax.request({
             url: datagrep.Constants.SERVER_BASE + '/datatable/upload',
             success: function(response, opts) {
                 var obj = Ext.decode(response.responseText);
                 if(obj.success) {
                     Ext.toast({
                         html: '上传发布成功',
                         align: 't'
                     });
                 } else {
                     Ext.toast({
                         html: '上传发布失败: ' + obj.error.code + ' ' + obj.error.error,
                         align: 't'
                     });
                 }
             },

             failure: function(response, opts) {
                 Ext.toast({
                     html: '上传发布失败',
                     align: 't'
                 });
             }
         });
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
    requires: ['datagrep.Constants'],
    alias: 'store.singletable',
    proxy: {
        type: 'ajax',
        api: {
            create: datagrep.Constants.SERVER_BASE + '/datatable/saveTable',
            read: datagrep.Constants.SERVER_BASE + '/datatable/loadTable'
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
