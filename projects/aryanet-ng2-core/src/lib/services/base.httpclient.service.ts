
import {throwError as observableThrowError,  Observable } from 'rxjs';

import { Injectable, Inject, ReflectiveInjector, Injector } from '@angular/core';
import {
    Http, Response, ResponseContentType,
    Headers, RequestOptions, RequestMethod, URLSearchParams
} from '@angular/http';

import {
    HttpClient, HttpResponse,
    HttpHeaders, HttpRequest,
    HttpParams,
    HttpErrorResponse,
} from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';

import { CoreInjector } from '../core.injector';
import { OperationResultModel } from '../models/operation-result.model';


@Injectable()
export class BaseHttpClientService {

    public http: HttpClient;

    constructor() {

        this.http = CoreInjector.injector.get(HttpClient);

    }


    public get(httpUrl?: string): Observable<any> {

        return this.http.get<any>(httpUrl)
            .pipe(
                catchError(this.handleError)
            )

    }

    public post(model: any, httpUrl: string): Observable<any> {

        let httparams = new HttpParams();
        httparams = this.appendHttpParams(httparams, model);

        // const headers = new HttpHeaders(
        //     {
        //         'Accept': 'application/json',
        //         'Content-Type': 'application/x-www-form-urlencoded'
        //     });


        const that = this;
        return this.http.post(httpUrl, model, { observe: 'response' })
            // httparams, { headers: headers })
            .pipe(
                map(res => {

                    return this.handleResponse(res);
                }),
                catchError(this.handleError)
            )



    }

    public put(model: any, httpUrl: string): Observable<any> {
        // const body = JSON.stringify(model);
        //  const body = new URLSearchParams();
        // this.appendParams(body, model);

        // const headers = new HttpHeaders(
        //   {
        //     'Accept': 'application/json',
        //     'Content-Type': 'application/json;',
        //     // 'Content-Type': 'application/x-www-form-urlencoded'
        //   });

        const that = this;
        return this.http.put(httpUrl, model, { observe: 'response' })
            .pipe(
                map(res => {

                    return this.handleResponse(res);
                }),
                catchError(this.handleError)
            )

    }

    public delete(httpUrl: string): Observable<any> {

        const that = this;
        return this.http.delete(httpUrl, { observe: 'response' })
            .pipe(
                map(res => {

                    return this.handleResponse(res);
                }),
                catchError(this.handleError)
            )

    }



    public upload(model: any, files: File[], httpUrl: string): Observable<any> {

        let httparams = new HttpParams();
        httparams = this.appendHttpParams(httparams, model);

        const headers = new HttpHeaders(
            {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data'
            });
        var fd = new FormData();
        files.forEach(file => {
            fd.append('files', file);
        });


        const that = this;
        return this.http.post(httpUrl, fd, { headers: headers })
            .pipe(
                // map(res => {

                //     return this.handleResponse(res);
                // }),
                catchError(this.handleError)
            )



    }



    protected handleResponse(res) {
        let result = <OperationResultModel>{};

        if (res.body == null) {
            if (res.status >= 200 && res.status < 300)
                result.status = true;
            else
                result.status = false;
        }
        else {
            result = <OperationResultModel>res.body;
        }

        result.httpStatus = res.status;
        return result;
    }


    public handleError(err: HttpErrorResponse): Observable<any> {
        console.error('observable error: ', err);
        const r = <OperationResultModel>err.error;
        return observableThrowError(r.description || err.statusText);
        // return Observable.throw(err.statusText);
    }


    public appendHttpParams(params: HttpParams, obj: any): HttpParams {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                params = params.set(key, obj[key]);
            }
        }
        return params;
    }




}





