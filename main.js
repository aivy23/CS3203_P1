$(function () {
    // Handle the case for showing all tweets
    $('#shwBtn').on('click', function() {
        // Standard get request
        $.ajax({
            url: '/tweets',
            contentType: 'application/json',
            success: function(response) {
                // using the response from the get request, customize the html
                var tbodyEl = $('#tweets');

                tbodyEl.html('');
                response.forEach(function(tweet) {
                    tbodyEl.append('\
                        <tr>\
                            <td>' + tweet.created_at + '</td>\
                            </td>\
                            <td>' + tweet.text + '</td>\
                            </td>\
                        </tr>\
                    ');
                });
            }
        })
    });

    // Another simple get request, just listing user IDs
    $('#shwIDs').on('click', function() {
        $.ajax({
            url: '/ids',
            contentType: 'application/json',
            success: function(response) {
                var tbodyEl = $('#users');
                // Same as last time in terms of request and html
                tbodyEl.html('');
                response.forEach(function(tweet) {
                    tbodyEl.append('\
                        <tr>\
                            <td>' + tweet.id + '</td>\
                            </td>\
                        </tr>\
                    ');
                });
            }
        })
    });

    // Originally thought of a get request,
    // but the req.body would not populate, so taking into the input
    // must have required a POST request
    $('#search-user').on('submit', function(event) { // allows for enter
        event.preventDefault();             // as well as button presses
        var idInput = $('#id-input');
        // console.log(idInput);

        $.ajax({
            url: '/tweets/user',
            method: 'POST', //specify, not default 'GET'
            contentType: 'application/json',
            data: JSON.stringify({id: idInput.val()}), //define and correct data
            success: function(response) {
                var tbodyEl = $('#user-tweet');
                tbodyEl.html('');
                if (response === 'null') { // tweet not found case
                    tbodyEl.append('\
                    <tr>\
                        <td>Tweet not found.</td>\
                    </tr>\
                    ');
                }
                
                else { // otherwise, do as task 1 and 3
                    tbodyEl.append('\
                    <thead>\
                        <th>[Created at]</th>\
                        <th>[Text]</th>\
                    </thead>\
                    <tr>\
                        <td>' + response.created_at + '</td>\
                        </td>\
                        <td>' + response.text + '</td>\
                        </td>\
                    </tr>\
                    ');
                }
            }
        })
    });
    // More of a true 'POST' request
    $('#add-tweet').on('submit', function(event) {
        event.preventDefault();
        
        var tweetTxt = $('#tweet-text');
        var idInput = $('#tweet-id');

        // Similar in terms of requests and transferring to server, much different
        // request handler in server.js though
        $.ajax({
            url: '/tweets/new',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({text: tweetTxt.val(), id: idInput.val()}),
            success: function(response) {
                console.log(response);
                tweetTxt.val('');
                idInput.val('');
            }
        });
    });

    // Put example, take in name and new screen name, send both, 
    // name as an identifier and screen name as new 
    $('#update').on('submit', function(event) {
        event.preventDefault();
        
        var name = $('#user-name');
        var screenName = $('#screen-name');
        
        $.ajax({
            url: '/tweets/name',
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({name: name.val(), screen_name: screenName.val()}),
            success: function(response) {
                console.log(response);
                name.val('');
                screenName.val('');
            }
        });
    });

    // Simply delets with tweet id, will also auto-call shwBttn to show
    // updated list
    $('#delete-tweet').on('submit', function(event) {
        event.preventDefault();
        
        var id = $('#tweet-del');
        
        $.ajax({
            url: '/tweets/delete',
            method: 'DELETE',
            contentType: 'application/json',
            data: JSON.stringify({id: id.val()}),
            success: function(response) {
                console.log(response);
                $('#shwBtn').trigger('click');
                id.val('');
            }
        });
    });

});