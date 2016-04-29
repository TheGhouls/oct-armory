import { SearchSource } from 'meteor/meteorhacks:search-source';
import { Plans } from './plans/plansCollections.es6.js';

SearchSource.defineSource('plans', function(searchText, options) {
  var options = {sort: {isoScore: -1}, limit: 20};
  
  if(searchText) {
    var regExp = buildRegExp(searchText);
    var selector = {$or: [
      {name: regExp},
      {short_description: regExp}
    ]};
    
    return Plans.find(selector, options).fetch();
  } else {
    return ['No Battle Plans match your request'];
  }
});

function buildRegExp(searchText) {
  // this is a dumb implementation
  var parts = searchText.trim().split(/[ \-\:]+/);
  return new RegExp("(" + parts.join('|') + ")", "ig");
}