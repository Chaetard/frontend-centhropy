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

        // Replace light mode dividers: bg-black/XX -> bg-[#222944]/XX
        newContent = newContent.replace(/\bbg-black\/(\d+)/g, 'bg-[#222944]/$1');
        
        // Replace light mode borders: border-black/XX -> border-[#222944]/XX
        newContent = newContent.replace(/\bborder-black\/(\d+)/g, 'border-[#222944]/$1');
        
        // Replace solid border-black (without opacity) -> border-[#222944]
        // Often used for solid lines.
        // Avoid replacing existing dark: border or other complex stuff.
        newContent = newContent.replace(/\bborder-black\b(?!\/)/g, 'border-[#222944]');
        
        // Handle text-black/XX as well? The user specified "líneas divisorias", 
        // but often lines are bg-black. Let's stick to bg and border for now as requested.

        if (content !== newContent) {
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log('Updated', filePath);
        }
    }
});
