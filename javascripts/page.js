window.onload = function(e) {
    var html = document.body.innerHTML;

    var toggleTreeVisibility = window.toggleTreeVisibility = function() {
        var indexElement = document.getElementById('index');
        var toggleElement = document.getElementById('toggle');
        if (indexElement.className == 'collapsed') {
            indexElement.className = 'expanded';
            toggleElement.innerHTML = 'Hide Index';
        } else {
            indexElement.className = 'collapsed';
            toggleElement.innerHTML = 'Show Index';
        }
    };
};