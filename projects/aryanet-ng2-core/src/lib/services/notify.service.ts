
import { Injectable } from '@angular/core';

import { SnotifyService, SnotifyPosition, SnotifyToastConfig } from 'ng-snotify';
import { CoreInjector } from '../core.injector';

@Injectable()
export class NotifyService {

    notify:SnotifyService;
    private t: number | undefined = 2000;
    private notifyConfig: SnotifyToastConfig = {
        position: 'rightTop',
        timeout: this.t,
        buttons: <any[]>[],
        showProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        backdrop: -1,
        // icon: 'assets/custom-svg.svg',

    };

    constructor(){
        this.notify = CoreInjector.injector.get(SnotifyService);
    }


    showSuccess(message?: string) {
        this.notify.clear();
        this.notify.success(message || 'عملیات با موفقیت انجام گردید', '', this.notifyConfig);

    }

    showError(message?: string) {
        this.notify.clear();

        this.notify.error(message || 'خطایی در اجرای عملیات رخ داده', '',
            this.notifyConfig);

    }
    showWarning(message?: string) {
        this.notify.clear();

        this.notify.warning(message || 'خطایی در اجرای عملیات رخ داده', '', this.notifyConfig);

    }

    showDeleteConfirm(okAction: any) {
        this.notify.clear();

        const config = Object.assign({}, this.notifyConfig);
        const that = this;
        config.position = 'centerCenter';
        config.closeOnClick = false;
        config.showProgressBar = false;
        config.backdrop = 1;
        config.timeout = undefined;

        config.buttons = [
            {
                text: 'تایید',
                action: (toast) => {
                    if (okAction) {
                        setTimeout(() => {
                            okAction();
                            that.notify.clear();
                        }, 500);
                    }
                    this.notify.remove(toast.id);

                },
                bold: true
            },
            {
                text: 'انصراف',
                action: (toast) => {
                    this.notify.remove(toast.id);
                },
                bold: false
            },
        ];

        this.notify.confirm(
             'آیا از حذف رکورد(ها) انتخابی اطمینان دارید؟',
            'حذف',
            config);

    }
    
    showConfirm(okAction: any, body: string, title: string) {
        this.notify.clear();

        const config = Object.assign({}, this.notifyConfig);
        const that = this;
        config.position = 'centerCenter';
        config.closeOnClick = false;
        config.showProgressBar = false;
        config.backdrop = 1;
        config.timeout = undefined;

        config.buttons = [
            {
                text: 'تایید',
                action: (toast) => {
                    if (okAction) {
                        setTimeout(() => {
                            okAction();
                            that.notify.clear();
                        }, 500);
                    }
                    this.notify.remove(toast.id);

                },
                bold: true
            },
            {
                text: 'انصراف',
                action: (toast) => {
                    this.notify.remove(toast.id);
                },
                bold: false
            },
        ];

        this.notify.confirm(
            body,
            title ,
            config);

    }
    
}

