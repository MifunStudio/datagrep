Ext.define('datagrep.view.table.CreateTableWindowViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.createtablewindow',

    stores: {
        DataTable: {
            type: 'datatable'
        }
    }
});
