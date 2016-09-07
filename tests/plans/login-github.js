describe('Login to Armory with GitHub', function(){
  it( 'should log to armory with github credential @watch', function() {
    let site = browser.url('http://localhost:3000/');
    site.waitForExist('#menu-btn', 3500);
    site.click('#menu-btn');
    site.waitForExist('.sign-in-text-github', 1500);
    site.click('.sign-in-text-github');
    site.timeoutsImplicitWait(1000);

    let getMeteorSettings = function (setting) {
      return Meteor.settings.public[setting]
    };
    let ghTestUser = server.execute(getMeteorSettings, 'ghTestUser');
    let ghTestPass = server.execute(getMeteorSettings, 'ghTestPass');
    let handleBefore = browser.windowHandle();
    let allWindowHandles = browser.windowHandles();
    site = browser.window(allWindowHandles.value[1]);
    site.waitForExist('#login_field', 4500);
    site.setValue('#login_field', ghTestUser);
    site.setValue('#password', ghTestPass);
    site.click('.btn-primary');
    site = browser.window(handleBefore.value);
    site.timeoutsImplicitWait(1500);
    let MenuBtnChanded = site.getText('a=Mon compte')

    expect( MenuBtnChanded ).to.equal( 'Mon compte' );

  });
});
