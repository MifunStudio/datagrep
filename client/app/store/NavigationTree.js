Ext.define('datagrep.store.NavigationTree', {
    extend: 'Ext.data.TreeStore',

    storeId: 'NavigationTree',
    root: {
        expanded: true,
        children: [
            {
                text:   '表格管理',
                view:   'table.DataTable',
                leaf:   true,
                iconCls: 'right-icon new-icon x-fa fa-star',
                viewName: 'dataTable'
            }
        ]
    },
    fields: [
        {
            name: 'text'
        }
    ]
});
