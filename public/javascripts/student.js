// Create user
function createUser() {
    const email = $('#email').val();
    const password = $('#password').val();
    const device = $('#device').val();

    if (!email || !password || !device) {
        window.alert("All fields are required!");
        return;
    }

    const txdata = { email, password, device };

    $.ajax({
        url: '/users/create',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(txdata),
        dataType: 'json',
    })
        .done(function (data) {
            $('#rxData').html(`<pre>${JSON.stringify(data, null, 2)}</pre>`);
        })
        .fail(function (err) {
            $('#rxData').html(`<pre>${JSON.stringify(err.responseJSON, null, 2)}</pre>`);
        });
}

// Read user by email
function readUser() {
    const email = $('#email').val();

    if (!email) {
        window.alert("Email is required to search!");
        return;
    }

    const txdata = { email };

    $.ajax({
        url: '/users/read',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(txdata),
        dataType: 'json',
    })
        .done(function (data) {
            $('#rxData').html(`<pre>${JSON.stringify(data, null, 2)}</pre>`);
        })
        .fail(function (err) {
            $('#rxData').html(`<pre>${JSON.stringify(err.responseJSON, null, 2)}</pre>`);
        });
}

// Delete user by email
function deleteUser() {
    const email = $('#email').val();

    if (!email) {
        window.alert("Email is required to delete!");
        return;
    }

    const txdata = { email };

    $.ajax({
        url: '/users/delete',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(txdata),
        dataType: 'json',
    })
        .done(function (data) {
            $('#rxData').html(`<pre>${JSON.stringify(data, null, 2)}</pre>`);
        })
        .fail(function (err) {
            $('#rxData').html(`<pre>${JSON.stringify(err.responseJSON, null, 2)}</pre>`);
        });
}

// Fetch all users
function readAllUsers() {
    $.ajax({
        url: '/users/readAll',
        method: 'GET',
    })
        .done(function (data) {
            $('#rxData').html(`<pre>${JSON.stringify(data, null, 2)}</pre>`);
        })
        .fail(function (err) {
            $('#rxData').html(`<pre>${JSON.stringify(err.responseJSON, null, 2)}</pre>`);
        });
}

$(function () {
    $('#btnCreate').click(createUser);
    $('#btnRead').click(readUser);
    $('#btnDelete').click(deleteUser);
    $('#btnReadAll').click(readAllUsers);
});
