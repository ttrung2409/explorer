import {Component, Input, Output, EventEmitter} from '@angular/core'
import {FileService} from '../services/fileService'

@Component({
    selector: 'file-uploader',
    templateUrl: './fileUpload.component.html'
})

export class FileUploadComponent {
    @Input() path;
    @Output() onUploadComplete: EventEmitter<void> = new EventEmitter<void>();

    constructor(private fileService: FileService) {
    }

    onChange(event) {
        if (event.target.files.length > 0) {
            this.fileService.upload(this.path, event.target.files[0]).then(() => {
                if (!!this.onUploadComplete) {
                    this.onUploadComplete.emit(event.target.files[0].name);
                }
            });            
        }        
    }
}