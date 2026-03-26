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

        // Replace bg-black for lines/dividers: bg-black/10 -> bg-black/10 dark:bg-[#BCC5DC]/10
        newContent = newContent.replace(/\bbg-black\/(\d+)(?!\s+dark:bg-\[#BCC5DC\]\/\1)/g, 'bg-black/$1 dark:bg-[#BCC5DC]/$1');
        
        // Ensure standard solid bg-black that acts as dividers also gets it? Or maybe avoid affecting text/buttons
        // Just the borders now
        newContent = newContent.replace(/\bborder-black\/(\d+)(?!\s+dark:border-\[#BCC5DC\]\/\1)/g, 'border-black/$1 dark:border-[#BCC5DC]/$1');
        
        // Also just simple border-black without opacity if followed by gap, etc... let's be careful.
        // I will do \bborder-black(?!\/\d+)(?!\s+dark:border-\[#BCC5DC\])/g
        newContent = newContent.replace(/\bborder-black(?!\/)(?!\s+dark:border-\[#BCC5DC\])/g, 'border-black dark:border-[#BCC5DC]');

        if (content !== newContent) {
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log('Updated', filePath);
        }
    }
});
