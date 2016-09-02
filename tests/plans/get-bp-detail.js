describe('get a Battle Plan detail from search result', function(){
  it( 'should find a Battle plan and go to detail page @watch', function() {
    let site = browser.url('http://localhost:3000/search');
    let getPlan = site.setValue('#search_input', 'armory');
    site.waitForExist('h4=armory-sample-project-v1.1', 15000);
    let getValueOfSearch = site.getText('h4=armory-sample-project-v1.1');
    let bpDetail = site.click('h4=armory-sample-project-v1.1');
    bpDetail.waitForExist('h1=armory-sample-project-v1.1', 15000);
    let getNameOfBP = bpDetail.getText('h1=armory-sample-project-v1.1');
    expect( getNameOfBP ).to.equal( 'armory-sample-project-v1.1' );

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
