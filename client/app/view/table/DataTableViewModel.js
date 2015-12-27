Ext.define('datagrep.view.table.DataTableViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.datatable',

    stores: {
        DataTable: {
            type: 'datatable'
        },
        Editors: {
            type: 'editors'
        }
    }
});
