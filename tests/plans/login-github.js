describe('Login to Armory with GitHub', function(){
  it( 'should log to armory with github credential @watch', function() {
    let site = browser.url('http://localhost:3000/');
    let clickMenuBtn = site.click('a=Connection');
    site.waitForExist('.sign-in-text-github', 15000);
    clickMenuBtn.click('.sign-in-text-github');
    site.timeoutsImplicitWait(1000);

    let getMeteorSettings = function (setting) {
      return Meteor.settings.public[setting]
    };
    let ghTestUser = server.execute(getMeteorSettings, 'ghTestUser');
    let ghTestPass = server.execute(getMeteorSettings, 'ghTestPass');
    console.log(ghTestUser);

    let handleBefore = browser.windowHandle();
    let allWindowHandles = browser.windowHandles();

    for (let i = allWindowHandles.value.length - 1; i >= 1; i--){
      site = browser.window(allWindowHandles.value[i]);
    }
    site.timeoutsImplicitWait(500);
    site.setValue('#login_field', ghTestUser);
    site.setValue('#password', ghTestPass);
    site.click('.btn-primary');
    site = browser.window(handleBefore.value);
    site.timeoutsImplicitWait(1500);

    let MenuBtnChanded = site.getText('a=Mon compte')

    expect( MenuBtnChanded ).to.equal( 'Mon compte' );

  });
});
