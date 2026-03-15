import fs from 'fs';
import path from 'path';

function walkSync(currentDirPath, callback) {
    fs.readdirSync(currentDirPath).forEach(function (name) {
        var filePath = path.join(currentDirPath, name);
        if (filePath.includes('node_modules') || filePath.includes('.git') || filePath.includes('dist')) return;
        var stat = fs.statSync(filePath);
        if (stat.isFile()) {
            callback(filePath, stat);
        } else if (stat.isDirectory()) {
            walkSync(filePath, callback);
        }
    });
}

walkSync('./src', function(filePath) {
    if (filePath.endsWith('.jsx') || filePath.endsWith('.css') || filePath.endsWith('.js')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let newContent = content;

        // Replace text-[#1B2136] -> text-[#222944]
        // Often used for core text colors.
        newContent = newContent.replace(/text-\[#1B2136\]/g, 'text-[#222944]');
        
        // Replace occurrences of hex code directly (especially in index.css or manual styles)
        newContent = newContent.replace(/#1B2136/g, '#222944');
        
        // Also check for partial opacity text classes if any were missed or if they used the old color
        newContent = newContent.replace(/text-\[#1B2136\]\/(\d+)/g, 'text-[#222944]/$1');

        if (content !== newContent) {
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log('Updated', filePath);
        }
    }
});
