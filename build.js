const fs = require('fs');
const path = require('path');
const uglify = require('uglify-js');

const sourceDirectory = 'src';
const destinationDirectory = 'build';

if (path.existsSync(destinationDirectory)) {
    var oldFileNames = fs.readdirSync(destinationDirectory);
    for (var i = 0; i < oldFileNames.length; i++) {
        var oldFileName = path.join(destinationDirectory, oldFileNames[i]);
        fs.unlinkSync(oldFileName);
    }
    fs.rmdirSync(destinationDirectory);
    console.log('removed build directory');
} else {
    console.log('build directory doesn\'t exist');
}

fs.mkdirSync(destinationDirectory, '755');
console.log('created build directory');

var fileNames = fs.readdirSync(sourceDirectory);
var allFiles = [];

for (var i = 0; i < fileNames.length; i++) {
    var sourceFileName = path.join(sourceDirectory, fileNames[i]);
    var destinationFileName = path.join(destinationDirectory, fileNames[i]);
    var destinationCompressedFileName = path.join(destinationDirectory, fileNames[i].replace(/.js$/, '-min.js'));
    
    var sourceFile = String(fs.readFileSync(sourceFileName));
    allFiles.push(sourceFile);
    
    var compressedFile = uglify(sourceFile);
    
    fs.writeFileSync(destinationFileName, sourceFile);
    console.log('copied ' + sourceFileName + ' into ' + destinationFileName);
    fs.writeFileSync(destinationCompressedFileName, compressedFile);
    console.log('compressed ' + sourceFileName + ' into ' + destinationCompressedFileName);
}

var composedFile = allFiles.join('');
var compressedComposedFile = uglify(composedFile);
fs.writeFileSync(path.join(destinationDirectory, 'jshelpers.js'), composedFile);
console.log('composed all files into ' + path.join(destinationDirectory, 'jshelpers.js'));
fs.writeFileSync(path.join(destinationDirectory, 'jshelpers-min.js'), compressedComposedFile);
console.log('compressed all files into ' + path.join(destinationDirectory, 'jshelpers-min.js'));
