describe('RM a BP from myPlan page ', function(){
  it( 'should log to armory with github credential and RM a BP from myPlan page @watch', function() {
    let site = browser.url('http://localhost:3000/');

    site.click('a=Mon compte');
    site.click('a=My Battle Plan');
    site.click('[name="armory-sample-project-v1.1"]');

    let checkForBpName = site.getText('.s-alert-box');
    expect( checkForBpName ).to.equal( 'armory-sample-project-v1.1 was successfuly deleted !' );

  });

  afterEach( function(){
    let site = browser.url('http://localhost:3000/plan/add');
    site.timeoutsImplicitWait(15000)
    site.click('[name="armory-sample-project-v1.1"]');
  });
});
