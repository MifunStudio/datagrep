Ext.define('datagrep.store.DataTable', {
    requires: [
        'Ext.data.proxy.Ajax',
        'datagrep.Constants'
    ],
    extend: 'Ext.data.Store',
    alias: 'store.datatable',
    storeId: 'DataTable',
    model: 'datagrep.model.DataTable',
    proxy: {
        type: 'ajax',
        api: {
            create: datagrep.Constants.SERVER_BASE + '/datatable/create',
            read: datagrep.Constants.SERVER_BASE + '/datatable/list',
            update: datagrep.Constants.SERVER_BASE + '/datatable/update',
            destroy: datagrep.Constants.SERVER_BASE + '/datatable/remove'
        },
        reader: {
            type: 'json',
            successProperty: 'success',
            rootProperty: 'data'
        }
    },
    autoSync: true,
    autoDestroy: false
});
