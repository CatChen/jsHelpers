const fs = require('fs');
const uglify = require('uglify-js');

const sourceDirectory = 'src/';
const destinationDirectory = 'build/';

try {
    var oldFileNames = fs.readdirSync(destinationDirectory);
    for (var i = 0; i < oldFileNames.length; i++) {
        var oldFileName = destinationDirectory + oldFileNames[i];
        fs.unlinkSync(oldFileName);
    }
    fs.rmdirSync(destinationDirectory);
    console.log('removed build directory');
} catch(e) {
    if (e.code == 'ENOENT') {
        console.log('build directory doesn\'t exist');
    } else {
        throw e;
    }
}

fs.mkdirSync(destinationDirectory, '755');
console.log('created build directory');

var fileNames = fs.readdirSync(sourceDirectory);
var allFiles = [];

for (var i = 0; i < fileNames.length; i++) {
    var sourceFileName = sourceDirectory + fileNames[i];
    var destinationFileName = destinationDirectory + fileNames[i];
    var destinationCompressedFileName = destinationDirectory + fileNames[i].replace(/.js$/, '-min.js');
    
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
fs.writeFileSync(destinationDirectory + 'jshelpers.js', composedFile);
console.log('composed all files into ' + destinationDirectory + 'jshelpers.js');
fs.writeFileSync(destinationDirectory + 'jshelpers-min.js', compressedComposedFile);
console.log('compressed all files into ' + destinationDirectory + 'jshelpers-min.js');
