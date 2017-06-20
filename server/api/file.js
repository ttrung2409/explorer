const express = require('express')
const router = express.Router()
const Explorer = require('../Explorer')
const fs = require('fs');
const path = require('path');
const Busboy = require('busboy');
const mime = require('mime');

const myDirectory = './MyDirectory';

router.get('/explore/:path?', function (req, res) {    
    var explorer = new Explorer();
    var files = [];        
    explorer.on('file', function (file) {
        files.push({
            name: path.basename(file),
            path: file.substring(myDirectory.length - 1),
            isDir: false
        });
    });

    explorer.on('dir', function (dir) {
        files.push({
            name: path.basename(dir),
            path: dir.substring(myDirectory.length - 1),
            isDir: true
        });
    });

    explorer.on('end', function () {
        console.log('end', files);
        res.json(files);
    });

    explorer.on('error', function (err) {
        console.log(err);        
    })

    explorer.explore(path.join(myDirectory, !!req.params.path ? decodeURIComponent(req.params.path) : ''));
})

router.post('/createdir', function (req, res) {
    createRootDir(function () {
        fs.mkdir(path.join(myDirectory, req.body.path), function (err) {
            if (err) {
                console.log(err);                
            }

            res.end();
        });  
    });
})

router.post('/rename', function (req, res) {    
    var newPath = path.join(myDirectory, path.dirname(req.body.path), req.body.name);
    fs.rename(path.join(myDirectory, req.body.path), newPath, function (err) {
        if (err) {
            console.log(err);
        }

        res.end();
    });
})

router.post('/upload', function (req, res) {
    var busboy = new Busboy({ headers: req.headers });
    var dirPath = '';
    busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
        console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
        var stream = fs.createWriteStream(path.join(myDirectory, dirPath, filename));
        file.pipe(stream);        
        file.on('data', function (data) {
            console.log('File [' + fieldname + '] got ' + data.length + ' bytes');
        });

        file.on('end', function () {
            console.log('File [' + fieldname + '] Finished');
        });
    });

    busboy.on('field', function (fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
        if (fieldname.toLowerCase() == 'path') {
            dirPath = decodeURIComponent(val);
        }

        console.log('Field [' + fieldname + ']: value: ' + val);
    });

    busboy.on('finish', function () {
        console.log('Done parsing form!');        
        res.end();
    });

    req.pipe(busboy);
});

router.get('/download/:path', function (req, res) {
    var filePath = path.join(myDirectory, decodeURIComponent(req.params.path));
    res.download(filePath);
})

router.post('/delete', function (req, res) {
    var filePath = path.join(myDirectory, req.body.path);
    if (req.body.isDir) {
        fs.rmdir(filePath, function (err) {
            if (err) {
                console.log(err);                
            }

            res.end();
        });
    }
    else {
        fs.unlink(filePath, function (err) {
            if (err) {
                console.log(err);
            }

            res.end();
        });
    }
})

function createRootDir(callback) {
    fs.exists(myDirectory, function (exists) {
        if (!exists) {
            fs.mkdir(myDirectory, function (err) {
                if (err) {
                    console.log(err);
                    return;
                }

                if (!!callback) {
                    callback();
                }
            });
        }
        else {
            if (!!callback) {
                callback();
            }
        }
    })
}

module.exports = router
