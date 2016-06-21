import { Template } from 'meteor/templating';
import './search.jade';
import '../planBox/planBox.js';
import { Plans } from '../../../api/plans/plansCollections.es6.js';
import { SearchSource } from 'meteor/meteorhacks:search-source';

let options = {
  keepHistory: 1000 * 60 * 5,
  localSearch: false
};

let fields = ['name', 'short_description', 'readme'];
let PlansSearch = new SearchSource('plans', fields, options);

Template.search.events({
  'keyup #search_input': _.debounce((e) => {
    var text = $(e.target).val().trim();
    if(text.length >= 3){
      PlansSearch.search(text);
    }

  }, 300)
});

Template.search.helpers({
  getSearchRes () {
    let res = PlansSearch.getData({
          sort: { isoScore: -1 }
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
  },

  getSearchPlaceholder () {
    return TAPi18n.__("search.title");
  }

});

// Template.search.onCreated({

// });

// Template.search.onRendered({

// });

// Template.search.onDestroyed({

// });
