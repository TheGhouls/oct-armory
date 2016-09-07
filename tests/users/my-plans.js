describe('Go to myPlan page', function(){
  it( 'should be already logged to armory with github credential and go to myPlan page @watch', function() {
    let site = browser.url('http://localhost:3000/');
    site.click('a=Mon compte');
    site.click('a=My Battle Plan');
    let checkForBpName = site.getText('td=armory-sample-project-v1.1');
    expect( checkForBpName ).to.equal( 'armory-sample-project-v1.1' );
  });
});
