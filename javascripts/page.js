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

document.getElementById('container').innerHTML = '<div id="tree">' + treeHTML + '</div>' + html;

var codes = document.getElementsByTagName('code');
for (var i = 0; i < codes.length; i++) {
    codes[i].className = 'brush: js';
}
SyntaxHighlighter.config.tagName = 'code';
SyntaxHighlighter.all()
