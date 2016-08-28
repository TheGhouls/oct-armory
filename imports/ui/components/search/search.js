import { Template } from 'meteor/templating';
import './search.jade';
import '../planBox/planBox.js';
import { Plans } from '../../../api/plans/plansCollections.es6.js';
import { SearchSource } from 'meteor/meteorhacks:search-source';

let options = {
  keepHistory: 1000 * 60 * 5,
  localSearch: false
};

const fields = ['name', 'short_description', 'readme'];
let PlansSearch = new SearchSource('plans', fields, options);

Template.search.events({
  'keyup #search_input': _.debounce((e) => {
    if (e.keyCode == 13) {
      e.preventDefault();
    }
    let text = $(e.target).val().trim();
    if(text.length >= 2){
      PlansSearch.search(text);
    }

  }, 300),
  'keypress #search_input':(e) =>{
    if (e.keyCode == 13) {
      e.preventDefault();
    }
  }

});

Template.search.helpers({
  getSearchRes () {
    let res = PlansSearch.getData({
          sort: { isoScore: -1 }
        });
    if(res.length >= 1){
      return res;
    } else {
      //console.log('not found res: ', res.length);
      res.empty = true;
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

Template.search.onCreated(function (){
  $('#search_input').focus();
});

Template.search.onRendered(function (){
  $('#search_input').focus();
  $(document).keyup(function(e) {
    if (e.keyCode === 13){
      e.preventDefault();
    }
  });
});
