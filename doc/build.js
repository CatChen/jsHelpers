const fs = require('fs');
const path = require('path');
const showdown = new (require('showdown').converter)();
const mustache = require('mustache');

const docRoot = '.';
const templateFileName = path.join(docRoot, '/template.mustache');

var template = String(fs.readFileSync(templateFileName));

var buildIndex = function(html) {
    var headings = [];
    html = html.replace(/\<h([\d]).*?\>\<a name="(.*?)"\>/gm, function(wholeMatch, match1, match2) {
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
    return buildIndexHTML(headingStack);
};

var buildIndexHTML = function(stack) {
    var html = '<ul>';
    for (var i = 0; i < stack.length; i++) {
        var heading = stack[i];
        html += '<li><a href="#' + stack[i].name + '">' + stack[i].name + '</a>';
        if (stack[i].length > 0) {
            html += buildIndexHTML(stack[i]);
        }
        html += '</li>';
    }
    html += '</ul>';
    return html;
};

var processContent = function(html) {
    return html.replace(/\<h([\d]).*?\>(.*?)\<\/h[\d]\>/gm, function(wholeMatch, match1, match2) {
        return '<h' + match1 + '><a name="' + match2 + '">'+ match2 + '</a></h' + match1 + '>';
    }).replace(/\<code(.*?)\>/gm, function(wholeMatch, match1) {
        return '<code class="brush: js"' + match1 + '>';
    });
};

var processDirectory = function(directory) {
    console.log('change directory to: ' + directory);
    var fileNames = fs.readdirSync(directory);
    for (var i = 0; i < fileNames.length; i++) {
        var fileName = fileNames[i];
        var fileFullName = path.join(directory, fileName);
        if (fileName.match(/^\./)) {
            continue;
        }
        if (fs.statSync(fileFullName).isDirectory()) {
            processDirectory(fileFullName);
        } else if (fileName.match(/\.md$/)) {
            console.log('read file: ' + fileFullName);
            var fileContent = String(fs.readFileSync(fileFullName));
            var directoryDepth = (directory == '.') ? 0 : directory.split('/').length + 1;
            var relativePath = new Array(directoryDepth).join('../');
            var htmlContent = processContent(showdown.makeHtml(fileContent));
            var indexContent = buildIndex(htmlContent);
            var convertedFileContent = mustache.to_html(template, {
                title: fileContent.match(/# (.*)/) ? fileContent.match(/# (.*)/)[1] : 'jsHelpers',
                stylesheets: [
                    path.join(relativePath, 'stylesheets/default.css'),
                    path.join(relativePath, 'stylesheets/shCore.css'),
                    path.join(relativePath, 'stylesheets/shThemeDefault.css')
                ],
                javascripts: [
                    path.join(relativePath, 'javascripts/xregexp.js'),
                    path.join(relativePath, 'javascripts/shCore.js'),
                    path.join(relativePath, 'javascripts/shBrushJScript.js'),
                    path.join(relativePath, 'javascripts/page.js')
                ],
                index: indexContent,
                content: htmlContent
            });
            var convertedFileFullName = fileFullName.replace(/\.md$/, '.html');
            if (path.existsSync(convertedFileFullName)) {
                console.log('delete file: ' + convertedFileFullName);
                fs.unlinkSync(convertedFileFullName);
            }
            console.log('write file: ' + convertedFileFullName);
            fs.writeFileSync(convertedFileFullName, convertedFileContent);
        }
    }
};

processDirectory(docRoot);
