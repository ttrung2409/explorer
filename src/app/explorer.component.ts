import {Component, EventEmitter} from '@angular/core'
import {FileService} from '../services/fileService'

@Component({
    selector: 'explorer',
    templateUrl: './explorer.component.html',
    styleUrls: ['./explorer.component.css'],
    providers: [FileService]
})

export class ExplorerComponent {
    files = [];
    currentPath = '';
    focusOnNavigationItem = false;

    constructor(private fileService: FileService) {
    }

    ngOnInit() {
        this.fileService.explore(this.currentPath).then(files => {
            this.files = files;
            if (this.files.length > 0) {
                this.files[0].isFocused = true;
            }
        });
    }

    onFileClick(file) {
        if (!file.isFocused) {
            this.clearFocus();
            file.isFocused = true;
        }        
    }

    onFileKeyUp(event, file) {
        switch (event.keyCode) {
            case 113: // F2                
                file.isFocused = false;
                file.isRenaming = true;
                break;
            case 13: // Enter
                if (!!file.isDir) {
                    this.explore(file);
                }
                else {
                    this.download(file);
                }

                break;  
            case 46:
                this.delete(file);
                break;          
        }
    }

    onFileKeyDown(event, file) {
        switch (event.keyCode) {
            case 37: // Left
                var index = this.files.indexOf(file);
                if (index > 0) {
                    this.files[index].isFocused = false;
                    this.files[index - 1].isFocused = true;
                }
                else {
                    this.focusOnNavigationItem = true;
                }
                break;
            case 39: // Right
                var index = this.files.indexOf(file);
                if (index < this.files.length - 1) {
                    this.files[index].isFocused = false;
                    this.files[index + 1].isFocused = true;
                    this.focusOnNavigationItem = false;
                }                
                break;
        }
    }

    onFileBlur(file) {
        file.isFocused = false;
    }
    

    onFileNameTextBoxFocus(file) {
        file.oldName = file.name;
    }

    onFileNameTextBoxBlur(file) {
        file.isRenaming = false;
    }

    stopEventPropagation(event) {
        event.stopPropagation();
    }    

    onFileNameTextBoxKeyUp(event, file) {        
        switch (event.keyCode) {
            case 27: // Esc
                file.isFocused = true;
                file.isRenaming = false;
                file.name = file.oldName;
                break;
            case 13: // Enter
                event.stopPropagation();
                file.isFocused = true;
                file.isRenaming = false;
                this.rename(file);
                break;
            case 37: // Left
            case 39: // Right
                event.stopPropagation();
                break;
        }
    }

    onFileNameTextBoxKeyDown(event, file) {
        switch (event.keyCode) {
            case 37: // Left
            case 39: // Right
                event.stopPropagation();
                break;
        }
    }

    onNavigationItemKeyDown(event) {
        switch (event.keyCode) {            
            case 39: // Right                
                if (this.files.length > 0) {
                    this.focusOnNavigationItem = false;
                    this.files[0].isFocused = true;
                }
        }
    }

    createDir() {
        var variant = 0;
        var fileName = '';
        while (true) {
            fileName = variant == 0 ? 'New folder' : `New folder ${variant}`
            var existingFile = this.files.filter((file) => {
                return file.name.toLowerCase() == fileName.toLowerCase();
            })[0];

            if (!existingFile) {
                break;
            }

            variant++;
        }

        this.clearFocus();
        this.fileService.createDir(`${this.currentPath}\\${fileName}`);
        this.files.push({
            name: fileName,
            path: `${this.currentPath}\\${fileName}`,
            isDir: true,
            isRenaming: true
        });
    }

    clearFocus() {
        this.focusOnNavigationItem = false;
        this.files.forEach(file => {
            file.isFocused = false;
            file.isRenaming = false;
        });
    }
        
    explore(file) {
        this.currentPath += '/' + file.name;
        this.fileService.explore(this.currentPath).then(files => this.files = files);
        this.focusOnNavigationItem = true;
    }

    goBack() {
        this.currentPath = this.currentPath.substring(0, this.currentPath.lastIndexOf("/"));
        this.fileService.explore(this.currentPath).then(files => {
            this.files = files;
            if (!!this.currentPath) {
                this.focusOnNavigationItem = true;
            }
            else if (this.files.length > 0) {
                this.files[0].isFocused = true;
            }
        });
    }

    rename(file) {        
        this.fileService.rename(file.path, file.name).then(() => {
            file.path = `${this.currentPath}\\${file.name}`;
        });
    }    

    download(file) {
        this.fileService.download(file.path);
    }

    delete(file) {
        this.fileService.delete(file).then(() => {
            this.files = this.files.filter((item) => {
                return item.name.toLowerCase() != file.name.toLowerCase();
            });
        });
    }

    onUploadComplete(name) {
        this.files.push({
            name: name,
            path: `${this.currentPath}\\${name}`
        });
    }
}