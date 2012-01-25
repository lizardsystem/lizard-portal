{
    itemId: 'advies',
    title: 'Advies',
	xtype: 'portalpanel',
	items:[{
		flex: 1,
		items: [{
			title: 'Advies',
            flex:1
		}]
	}]
}


document.forms["myform"].submit();

login_window = Ext.create('Ext.window.Window', {
    id: 'loginwindow'
    width: 200
    height: 200
    title: 'Login'
}).show()

login_window.insertFirst(Ext.get('loginform'))

