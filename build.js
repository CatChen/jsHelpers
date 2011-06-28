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
    var destinationFileName = destinationDirectory + fileNames[i].replace(/.js$/, '-min.js');
    
    var sourceFile = String(fs.readFileSync(sourceFileName));
    allFiles.push(sourceFile);
    
    var compressedFile = uglify(sourceFile);
    
    fs.writeFileSync(destinationFileName, compressedFile);
    console.log('compressed ' + sourceFileName + ' into ' + destinationFileName);
}

var compressedAllFiles = uglify(allFiles.join(''));
fs.writeFileSync(destinationDirectory + 'jshelpers-min.js', compressedAllFiles);
console.log('compressed all files into ' + destinationDirectory + 'jshelpers-min.js');
