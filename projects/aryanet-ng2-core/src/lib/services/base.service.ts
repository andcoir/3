

import {
    HttpClient, HttpParams,
} from '@angular/common/http';


import { NotifyService } from '../services/notify.service';
import { BrowserStorageService } from '../services/browser-storage.service';
import { CoreInjector } from '../core.injector';
import { AppConfigService } from '../services/app-config.service';
import { OperationResultModel } from '../models/operation-result.model';
import { SelectListModel } from '../models/select-list.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseHttpClientService } from './base.httpclient.service';


export class BaseService {
    baseHttpService: BaseHttpClientService;
    configService: AppConfigService;
    // loading: LoadingManager;
    notify: NotifyService;
    storageService: BrowserStorageService;

    public BASE_URL: string;
    public HTTP_URL: string;


    constructor(apiUrl: string) {

        this.configService = CoreInjector.injector.get(AppConfigService);
        this.notify = CoreInjector.injector.get(NotifyService);
        this.storageService = CoreInjector.injector.get(BrowserStorageService);
        this.BASE_URL = this.configService.config.apiHost;
        if (this.BASE_URL == undefined) {
            this.BASE_URL = '/api/v1/';//TODO
        }

        this.HTTP_URL = this.BASE_URL;
        if (apiUrl !== undefined && apiUrl != '') {
            this.HTTP_URL += `${apiUrl}`;
        }

        this.baseHttpService = new BaseHttpClientService();

    }


    public get(url?: string): Observable<any> {

        let httpUrl = `${this.HTTP_URL}`;
        if (url !== undefined) {
            httpUrl += `/${url}`;
        }

        const that = this;
        return this.baseHttpService.get(httpUrl)
            .pipe(
                map((res: OperationResultModel) => {
                    let result: any;
                    that.operationHandling(res, r => {
                        result = r;
                    });
                    return result || {};
                })
            );

    }


    public getByApiUrl(apiUrl: string): Observable<any[]> {

        const httpUrl = `${this.BASE_URL}${apiUrl}`;
        const that = this;

        return this.baseHttpService.get(httpUrl)
            .pipe(
                map((res: OperationResultModel) => {
                    let result: any;
                    that.operationHandling(res, r => {
                        result = r;
                    });

                    return result || {};
                })
            );



    }


    public getByParam(obj: any, url?: string): Observable<any[]> {
        const that = this;

        let httpUrl = `${this.HTTP_URL}`;
        if (url !== undefined) {
            httpUrl += `/${url}`;
        }

        let httparams = new HttpParams();
        httparams = this.appendHttpParams(httparams, obj);
        return this.baseHttpService.get(httpUrl)
            .pipe(map((r: OperationResultModel) => {
                let result: any[];
                that.operationHandling(r, (r: any[]) => {
                    result = r;
                });

                return result;
            })

            );

    }


    public post(model: any, url?: string): Observable<any> {

        let httparams = new HttpParams();
        httparams = this.appendHttpParams(httparams, model);
        let httpUrl = `${this.HTTP_URL}`;
        if (url !== undefined) {
            httpUrl += `/${url}`;
        }

        const that = this;
        return this.baseHttpService.post(model, httpUrl)
            .pipe(
                map((res: OperationResultModel) => {

                    let result: any;
                    that.operationHandling(res, r => {
                        result = r;
                    });
                    return result || {};
                })

            );

    }


    public put(id: number, model: any, url?: string): Observable<any> {

        let httpUrl = `${this.HTTP_URL}`;
        if (url !== undefined) {
            httpUrl += `/${url}`;
        }

        const that = this;
        return this.baseHttpService.put(model, httpUrl + "/" + id)
            .pipe(
                map((res) => {

                    let result: any;
                    that.operationHandling(res, r => {
                        result = r;
                    });
                    return result || {};
                })

            );

    }

    public delete(id: number, url?: string): Observable<any> {

        let httpUrl = `${this.HTTP_URL}`;
        if (url !== undefined) {
            httpUrl += `/${url}`;
        }

        const that = this;
        return this.baseHttpService.delete(`${httpUrl}/${id}`)
            .pipe(
                map((res: OperationResultModel) => {

                    let result: any;
                    that.operationHandling(res, r => {
                        result = r;
                    });
                    return result || {};
                })

            );

    }

    public deleteRange(id: Array<number>): Observable<any> {
        let q = '?';
        for (let i = 0; i < id.length; i++) {
            q += `ids=${id[i]}&`;
        }

        let httpUrl = `${this.HTTP_URL}`;
        const that = this;
        return this.baseHttpService.delete(httpUrl + '/deleteRange' + q)
            .pipe(
                map((res: OperationResultModel) => {
                    let result: any;
                    that.operationHandling(res, r => {
                        result = r;
                    });
                    return result || {};
                })

            );
    }

    public deleteAll(): Observable<OperationResultModel> {
        const that = this;
        return this.baseHttpService.post(null, '/deleteall')
            .pipe(
                map((res: OperationResultModel) => {

                    let result: any;
                    that.operationHandling(res, r => {
                        result = r;
                    });
                    return result || {};
                })

            );
    }






    public appendHttpParams(params: HttpParams, obj: any): HttpParams {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                params = params.set(key, obj[key]);
            }
        }
        return params;
    }


    public operationHandling(operation: OperationResultModel,
        successFunc?: any, errorFunc?: any): void {
        // this.loading.hide();
        if (operation.status == false) {
            if (errorFunc) {
                errorFunc();
            } else {
                this.notify.showError(operation.description);
            }
        } else {
            if (successFunc) {
                successFunc(operation.data);
            } else {
                this.notify.showSuccess();
            }
        }

    }










    // find<T>(id: number): Observable<T> {
    //     return this.get(UrlHelper.FindAsync + "/" + id);
    // }
}






export class BaseComboService extends BehaviorSubject<SelectListModel[]> {
    http: HttpClient;
    baseService: BaseService;
    apiUrl: string;

    constructor(apiUrl: string) {
        super(null);
        this.apiUrl = apiUrl;
        this.http = CoreInjector.injector.get(HttpClient);
        this.baseService = new BaseService(apiUrl);

        // this.baseService.API_URL += '/';
    }

    // public setHttpUrl(httpUrl: string) {
    //     this.apiUrl;
    //     this.baseService.HTTP_URL = httpUrl;
    // }


    public read(id: number): void {
        this.baseService.getByApiUrl(this.apiUrl + id)
            .subscribe(x => super.next(x));
    }
    public readAll(): void {
        this.baseService.getByApiUrl(this.apiUrl)
            .subscribe(x => {
                return super.next(x);

            });
    }

    public readAllByUrl(httpUrl: string): void {
        this.readAllByUrlObservable(httpUrl)
            .subscribe(x => {
                return super.next(x);

            });
    }


    public readAllByUrlObservable(httpUrl: string): Observable<any> {
        return this.baseService.getByApiUrl(httpUrl);


    }


}



