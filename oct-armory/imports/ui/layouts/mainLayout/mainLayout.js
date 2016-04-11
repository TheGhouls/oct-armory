import './mainLayout.jade';

Template.mainLayout.onCreated(function mainLayoutOnCreated() {
	this.autorun(() => {
	    console.log("onCreated mainLayout");
	  });
});