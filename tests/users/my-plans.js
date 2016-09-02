describe('Login to Armory with GitHub and go to myPlan page', function(){
  it( 'should log to armory with github credential and go to myPlan page @watch', function() {
    let site = browser.url('http://localhost:3000/');

    site.click('a=Mon compte');
    site.click('a=My Battle Plan');

    let checkForBpName = site.getText('td=armory-sample-project-v1.1');
    expect( checkForBpName ).to.equal( 'armory-sample-project-v1.1' );

  });

  // afterEach( function(){
  //   server.execute( function(){
  //     let plan = Plans.findOne({name: 'Armory Magento', owner: 'aurelben' });
  //     if (plan) {
  //       Plans.remove( plan._id);
  //     }
  //   });
  // });
});
