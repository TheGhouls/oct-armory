import { SearchSource } from 'meteor/meteorhacks:search-source';
import { Plans } from './plans/plansCollections.es6.js';

SearchSource.defineSource('plans', function(searchText, options) {
  var options = {sort: {isoScore: -1}, limit: 20};
  
  if(searchText) {
    var regExp = searchText;
    var selector = {$or: [
      {name: regExp},
      {short_description: regExp}
    ]};
    
    //return Plans.find(selector, options).fetch();
    res = Plans.find(
      { $text: {
          $search: searchText
        }
      },
      {
        fields: {
          score: {
            $meta: 'textScore'
          }
        },
        sort: {
          score: {
            $meta: 'textScore'
          }
        },
        limit: 20
      }
    ).count();

    console.log('search res is: ', res);
    return Plans.find(
      { $text: {
          $search: searchText
        }
      },
      {
        fields: {
          score: {
            $meta: 'textScore'
          }
        },
        sort: {
          score: {
            $meta: 'textScore'
          }
        },
        limit: 20
      }
    );
  } else {
    return ['No Battle Plans match your request'];
  }
});

function buildRegExp(searchText) {
  // this is a dumb implementation
  var parts = searchText.trim().split(/[ \-\:]+/);
  return new RegExp("(" + parts.join('|') + ")", "ig");
}

search_index_name = 'repo'

Plans._dropIndex(search_index_name);

Plans._ensureIndex({
        name: 'text',
        short_description: 'text',
        gh_readme: 'text',

    }, {
        name: 'repo'
    });