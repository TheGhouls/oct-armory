import { SearchSource } from 'meteor/meteorhacks:search-source';
import { Plans } from '../../plans/plansCollections.es6.js';

SearchSource.defineSource('plans', function(searchText, options) {
  var options = { sort: { isoScore: -1 }, limit: 20 };

  if(searchText) {
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
    ).fetch();
  } else {
    return ['No Battle Plans match your request'];
  }
});

function buildRegExp(searchText) {
  // this is a dumb implementation
  var parts = searchText.trim().split(/[ \-\:]+/);
  return new RegExp("(" + parts.join('|') + ")", "ig");
}

let search_index_name = 'plans_text_index';

try {
  Plans._dropIndex(search_index_name);
} catch (e) {
  console.log("_dropIndex Exception :", e);
}

Plans._ensureIndex({
        name: 'text',
        short_description: 'text',
        gh_readme: 'text',
        'armory_info.tags': 'text',

    }, {
        name: search_index_name
    });

