Ext.define('datagrep.view.main.ViewportController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.mainviewport',

    onMainViewRender: function() {

    },

    onNavigationTreeSelectionChange: function (tree, node) {
        if (node && node.get('view')) {
            this.setCurrentView(node);
        }
    },

    setCurrentView: function(node) {
        var me = this,
            refs = me.getReferences(),
            mainCard = refs.mainCardPanel,
            mainLayout = mainCard.getLayout(),
            navigationList = refs.navigationTreeList,
            viewModel = me.getViewModel(),
            vmData = viewModel.getData(),
            store = navigationList.getStore(),
            lastView = vmData.currentView,
            existingItem = mainCard.child('component[viewName=' + node.get('viewName') + ']'),
            newView;

        // Kill any previously routed window
        if (lastView && lastView.isWindow) {
            lastView.destroy();
        }

        lastView = mainLayout.getActiveItem();

        if (!existingItem) {
            newView = Ext.create('datagrep.view.' + node.get('view'), {
                viewName: node.get('viewName')
            });
        }

        if (existingItem) {
            // We don't have a newView, so activate the existing view.
            if (existingItem !== lastView) {
                mainLayout.setActiveItem(existingItem);
            }
            newView = existingItem;
        }
        else {
            // newView is set (did not exist already), so add it and make it the
            // activeItem.
            Ext.suspendLayouts();
            mainLayout.setActiveItem(mainCard.add(newView));
            Ext.resumeLayouts(true);
        }

        navigationList.setSelection(node);

        if (newView.isFocusable(true)) {
            newView.focus();
        }

        vmData.currentView = newView;
    }
});
