Ext.define('datagrep.model.DataTable', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'id', type: 'string' },
        { name: 'tableName', type: 'string' },
        { name: 'columns', type: 'string', defaultValue: '[]' }
    ],

    getColumns: function() {
        return JSON.parse(this.get('columns'));
    },

    setColumns: function(columns) {
        this.set('columns', JSON.stringify(columns));
    },

    addColumn: function(column) {
        var columns = this.getColumns();
        columns.push(column)
        this.setColumns(columns);
    }
});
