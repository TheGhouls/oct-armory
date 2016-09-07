describe('find a Battle Plan', function(){
  it( 'should find a Battle plan @watch', function() {
    let site = browser.url('http://localhost:3000/search');
    let getPlan = site.setValue('#search_input', 'armory');
    site.waitForExist('h4=armory-sample-project-v1.1', 15000);
    let getValueOfSearch = site.getText('h4=armory-sample-project-v1.1');

    expect( getValueOfSearch ).to.equal( 'armory-sample-project-v1.1' );

  });
});
