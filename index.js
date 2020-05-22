// The user must be able to search for parks in one or more states.
// The user must be able to set the max number of results, with a default of 10.
// The search must trigger a call to NPS's API.
// The parks in the given state must be displayed on the page. Include at least:
// Full name
// Description
// Website URL
// The user must be able to make multiple searches and see only the results for the current search.
// As a stretch goal, try adding the park's address to the results.
'use strict'

const CORS = 'https://cors-anywhere.herokuapp.com/';
const apiKey = 'thBIVKqHyCPglv0pdsoIltfQ4zEoLgKmZqgWt7Cq';
const searchURL = 'https://developer.nps.gov/api/v1/parks'


function multipleQueries(query) {
    const searchStates = [];
    for (let i = 0; i < query.length; i++) {
        console.log(`q=${query[i]}`);
        searchStates.push(`q=${query[i]}`);
        
    };
    return searchStates.join('&');
    console.log(searchStates);
};



function formatQueryParams(params) {
    const queryItems = Object.keys(params)

    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}


function getParks(query = 'New York', maxResults = 10) {
    console.log('getparks ran');
    const params = {
        limit: maxResults
    };
    console.log(query);
    const queryMore = multipleQueries(query);
    console.log(queryMore);

    const options = {
        headers: new Headers({
            "X-Api-Key": apiKey
        })
    }
    
    const queryString = formatQueryParams(params);
    console.log(queryString);
    console.log('param ran');
    const url = searchURL + '?' + queryString+ '&' + queryMore;
    console.log(url);

    fetch(CORS+url, options)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayResults(responseJson))
        .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
          })
      }

function displayResults(responseJson) {
    console.log('displayresults ran');
    console.log(responseJson);
    $('.results').empty();
    for (let i = 0; i < responseJson.data.length; i++) {
        $('.results').append(`<li><h3><a href="${responseJson.data[i].url}>">
        ${responseJson.data[i].fullName}</a></h3>
        <p>${responseJson.data[i].description}</p>
        <p><a href="${responseJson.data[i].url}">${responseJson.data[i].url}</a></p>`)
    };
}

function watchForm() {
    $('form').submit(event => {
        event.preventDefault();
        console.log('this ran');
        const searchTerm = $('.parks').val();
        const maxResults = $('.numbers').val();
        getParks(searchTerm, maxResults);
        
    });
}

$(watchForm());