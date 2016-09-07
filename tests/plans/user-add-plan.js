describe('Add a Battle Plan ', function(){
  it( 'should log to armory with github credential Add a Battle Plan @watch', function() {
    let site = browser.url('http://localhost:3000/');
    site.click('a=Mon compte');
    site.click('a=Ajouter un Battle Plan');
    site.timeoutsImplicitWait(15000)
    site.click('[name="armory-sample-project-v1.1"]');
    let checkForBpName = site.getText('.s-alert-box');
    expect( checkForBpName ).to.equal( 'Le Battle plan a bien été ajouté' );
  });

  beforeEach( function(){
    let site = browser.url('http://localhost:3000/');
    site.click('a=Mon compte');
    site.click('a=My Battle Plan');
    site.click('[name="armory-sample-project-v1.1"]');
  });
});
