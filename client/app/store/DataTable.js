Ext.define('datagrep.store.DataTable', {
    requires: [
        'Ext.data.proxy.Ajax'
    ],
    extend: 'Ext.data.Store',
    alias: 'store.datatable',
    storeId: 'DataTable',
    model: 'datagrep.model.DataTable',
    proxy: {
        type: 'ajax',
        api: {
            create: '/datatable/create',
            read: '/datatable/list',
            update: '/datatable/update',
            destroy: '/datatable/remove'
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
