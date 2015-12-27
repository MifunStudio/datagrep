Ext.define('datagrep.store.Editors', {
    extend: 'Ext.data.Store',
    alias: 'store.editors',
    storeId: 'Editors',
    fields: ['name'],
    data: [
        { name: '字符串', type: 'string' },
        { name: '整数', type: 'int' },
        { name: '是/否', type: 'boolean' },
        { name: '数字(小数)', type: 'number' }
    ],

    createEditor: function(type) {
        var editor;
        switch(type) {
            case 'string':
                editor = {
                    allowBlank: false
                };
            break;
            case 'int':
                editor = {
                    xtype: 'numberfield',
                    allowBlank: false,
                    minValue: -100000,
                    maxValue: 100000
                };
            break;
            case 'boolean':
                editor = new Ext.form.field.ComboBox({
                    typeAhead: true,
                    triggerAction: 'all',
                    store: [
                        ['true', true],
                        ['false', false]
                    ]
                });
            break;
            case 'number':
                editor = {
                    xtype: 'numberfield',
                    allowBlank: false,
                    minValue: -100000,
                    maxValue: 100000
                };
            break;
        }
        return editor;
    }
});
