const fs = require('fs');
const uglify = require('uglify-js');

try {
    fs.rmdirSync('build');
    console.log('removed build directory');
} catch(e) {
    if (e.code == 'ENOENT') {
        console.log('build directory doesn\'t exist');
    } else {
        throw e;
    }
}
fs.mkdirSync('build', '755');
console.log('created build directory');

var fileNames = fs.readdirSync('src');
console.log('read src directory');

for (var i = 0; i < fileNames.length; i++) {
    var sourceFileName = 'src/' + fileNames[i];
    var destinationFileName = 'build/' + fileNames[i];
    
    var sourceFile = String(fs.readFileSync(sourceFileName));
    console.log('read ' + sourceFileName);
    
    var compressedFile = uglify(sourceFile);
    console.log('compressed file');
    
    fs.writeFileSync(destinationFileName, compressedFile);
    console.log('written ' + destinationFileName);
}