const EventEmitter = require('events').EventEmitter;
const fs = require('fs');

class Explorer extends EventEmitter {  
    explore(path) {
        var self = this;                
        fs.readdir(path, function (err, files) {
            if (err) {
                self.emit('error', err);
            }

            var count = !!files ? files.length : 0;
            if (count == 0) {
                self.emit('end');
                return;
            }

            files.forEach(function (file) {
                var fpath = path + '/' + file;                
                fs.stat(fpath, function (err, stats) {
                    if (err) {
                        self.emit('error', err);
                    }

                    if (stats.isFile()) {
                        self.emit('file', fpath);
                    }
                    else if (stats.isDirectory()) {
                        self.emit('dir', fpath);
                    }
                    
                    count--;
                    if (count == 0) {
                        self.emit('end');
                    }
                });
            });
        });
    }
}

module.exports = Explorer