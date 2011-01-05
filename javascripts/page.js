var converter = new Showdown.converter();
var html = converter.makeHtml(document.getElementById('content').innerHTML);

var headings = [];
html = html.replace(/\<h([\d])\>(.*?)\<\/h[\d]\>/gm, function(wholeMatch, match1, match2) {
    headings.push({
        level: parseInt(match1),
        name: match2
    });
    return '<h' + match1 + '><a name="' + match2 + '">'+ match2 + '</a></h' + match1 + '>';
});

var headingStack = [];
var headingPointer = headingStack;
var headingLevel = 0;
for (var i = 0; i < headings.length; i++) {
    while (headings[i].level < headingLevel) {
        headingPointer = headingPointer.parent;
        headingLevel--;
    }
    if (headings[i].level == headingLevel) {
        var siblingHeading = [];
        headingPointer.parent.push(siblingHeading);
        siblingHeading.parent = headingPointer.parent;
        headingPointer = siblingHeading;
    }
    while (headings[i].level > headingLevel) {
        var childHeading = [];
        headingPointer.push(childHeading);
        childHeading.parent = headingPointer;
        headingPointer = childHeading;
        headingLevel++;
    }
    headingPointer.name = headings[i].name;
}

var buildHeadingTree = function(stack) {
    var html = '<ul>';
    for (var i = 0; i < stack.length; i++) {
        var heading = stack[i];
        html += '<li><a href="#' + stack[i].name + '">' + stack[i].name + '</a>';
        if (stack[i].length > 0) {
            html += buildHeadingTree(stack[i]);
        }
        html += '</li>';
    }
    html += '</ul>';
    return html;
};
var treeHTML = buildHeadingTree(headingStack);

var toggleTreeVisibility = function() {
    var treeElement = document.getElementById('tree');
    var toggleElement = document.getElementById('toggle');
    if (treeElement.className == 'collapsed') {
        treeElement.className = 'expanded';
        toggleElement.innerHTML = 'Hide Index';
    } else {
        treeElement.className = 'collapsed';
        toggleElement.innerHTML = 'Show Index';
    }
};
document.getElementById('container').innerHTML = '<div id="tree" class="collapsed"><a id="toggle" href="###" onclick="window.toggleTreeVisibility()">Show Index</a>' + treeHTML + '</div>' + html;

var codes = document.getElementsByTagName('code');
for (var i = 0; i < codes.length; i++) {
    codes[i].className = 'brush: js';
}
SyntaxHighlighter.config.tagName = 'code';
SyntaxHighlighter.all()

/* Google Analytics */
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-347601-11']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();
