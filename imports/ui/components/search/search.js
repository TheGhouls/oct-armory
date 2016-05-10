import { Template } from 'meteor/templating';
import './search.jade';
import '../planBox/planBox.js';
import { Plans } from '../../../api/plans/plansCollections.es6.js';
import { SearchSource } from 'meteor/meteorhacks:search-source';

let options = {
  keepHistory: 1000 * 60 * 5,
  localSearch: true
};
let fields = ['name', 'short_description'];

export let PlansSearch = new SearchSource('plans', fields, options);

Template.search.events({
  'keyup #search_input': _.throttle((e) => {
    var text = $(e.target).val().trim();
    PlansSearch.search(text);
    console.log(PlansSearch.getData());
  }, 200)
});

Template.search.helpers({

  getSearchRes () {
    let res = PlansSearch.getData({
          // transform: function(matchText, regExp) {
          //   return matchText.replace(regExp, "<b>$&</b>")
          // },
          sort: {isoScore: -1}
        });
    if(res.length >= 1){
      return res;
    } else {
      console.log('not found res: ', res.length);
      return [];
    }
  }, 

  searchLoading () {
    return PlansSearch.getStatus().loading;
  }
  
});

// Template.search.onCreated({

// });

// Template.search.onRendered({

// });

// Template.search.onDestroyed({

// });