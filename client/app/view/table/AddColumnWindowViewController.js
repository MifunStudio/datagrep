Ext.define('datagrep.view.table.AddColumnWindowViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.addcolumnwindow',

    id: 'addcolumnwindow',

    onAddColumnBtnOkClick: function() {
        var me = this,
            refs = me.getReferences(),
            addColumnForm = refs.addColumnForm,
            values = addColumnForm.getValues();

        me.getView().close();
        me.fireEvent('submitaddcolumn', values);
    }
});
