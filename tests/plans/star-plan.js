describe('User star a Battle Plan', function(){
  it( 'should find and star a Battle plan @watch', function() {
    let site = browser.url('http://localhost:3000/search');
    let getPlan = site.setValue('#search_input', 'armory');
    site.waitForExist('h4=armory-sample-project-v1.1', 15000);
    let getValueOfSearch = site.getText('h4=armory-sample-project-v1.1');
    let bpDetail = site.click('h4=armory-sample-project-v1.1');
    bpDetail.waitForExist('h1=armory-sample-project-v1.1', 15000);
    let getNameOfBP = bpDetail.getText('h1=armory-sample-project-v1.1');
    expect( getNameOfBP ).to.equal( 'armory-sample-project-v1.1' );
    site.click('.star-repo');
  });
});
