import {Injectable} from '@angular/core'
import { Http, Headers, ResponseContentType } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class FileService {
    headers = new Headers({ 'Content-Type': 'application/json' });

    constructor(private http: Http) {
    }

    explore(path = '') {
        return this.executeRequest(`api/file/explore/${encodeURIComponent(path)}`).then(files => files || []);
    }

    createDir(path) {
        return this.executeRequest('api/file/createDir', 'POST', {
            path: path
        });        
    }

    rename(path, name) {
        return this.executeRequest('api/file/rename', 'POST', {
            path: path,
            name: name
        });
    }

    upload(path, file) {
        let formData: FormData = new FormData();
        formData.append('path', encodeURIComponent(path));
        formData.append('uploadFile', file, file.name);
        return this.http.post('api/file/upload', formData)
            .toPromise()
            .then(res => console.log(res))
            .catch(err => console.log(err));
    }

    download(path) {        
        this.http.get(`api/file/download/${encodeURIComponent(path)}`, { responseType: ResponseContentType.Blob }).subscribe(res => {
            console.log(res);
            let file = new Blob([res.blob()], { type: 'application/octet-stream' });
            var link = document.createElement('a');
            link.href = window.URL.createObjectURL(file);
            link.download = path.replace(/^.*[\\\/]/, '');
            link.click();
        });
    }

    delete(file) {
        return this.executeRequest('api/file/delete', 'POST', file);
    }

    private executeRequest(url, method = 'GET', data = null, params = null) {
        return this.http.request(url, {
            method: method,
            headers: this.headers,
            params: params,
            body: JSON.stringify(data)
        })
        .toPromise()
        .then(res => {            
            console.log(res);                
            if (res.status >= 200 && res.status < 300) {
                var contentType = res.headers.get('content-type');
                return !!contentType ? contentType.indexOf('application/json') >= 0 ? res.json() : null : null;
            }
            else {
                throw new Error(res.text());
            }                
        })                
        .catch(err => console.log(err));
    }    
}