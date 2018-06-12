import { Observable } from 'rxjs';
import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AppConfigModel } from '../models/app-config.model';


@Injectable()
export class AppConfigService {

    public config = <AppConfigModel>{};

    constructor(private http: HttpClient) {

    }

    get apiRoot() {
        return this.getProperty('host'); // <--- THIS GETS CALLED FIRST
    }


     load(): Promise<any> {
        const promise = this.http
            .get('assets/config.json')
            .toPromise()
            .then((config:AppConfigModel) => {
                this.config = config;     // <--- THIS RESOLVES AFTER
    
            });


        // promise.then(config => {
        //     debugger;
        //     this.config = config;     // <--- THIS RESOLVES AFTER

        // });
        return promise;

    }

    private getProperty(property: string): any {
        //noinspection TsLint
        if (!this.config) {
            throw new Error('Attempted to access configuration property before configuration data was loaded, please implemented.');
        }

        if (!this.config[property]) {
            throw new Error(`Required property ${property} was not defined within the configuration object. Please double check the
        assets/config.json file`);
        }

        return this.config[property];
    }

}
