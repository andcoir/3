import { NgModule, Injector, APP_INITIALIZER, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';




// third party
import { SnotifyModule, SnotifyService, ToastDefaults } from 'ng-snotify';
import { DpDatePickerModule } from 'ng2-jalali-date-picker';
import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';



import { CoreInjector } from '@app/core/core.injector';
import { NotifyService } from '@app/core/services/notify.service';
import { AppConfigService } from '@app/core/services/app-config.service';
import { AppConfigModel } from "./models/app-config.model";
import { BaseService, BaseComboService } from '@app/core/services/base.service';
import { BaseKendoGridService } from '@app/core/services/base-kendo-grid.service';
import { BrowserStorageService } from '@app/core/services/browser-storage.service';
import { AppErrorHandler } from '@app/core/services/error-handler';

import { UtilsService } from "./services/utils.service";
import { AuthService, RefreshTokenService, TokenStoreService, AuthGuard } from "@app/core";


import { LoaderInterceptor } from "./interceptors/loader.interceptor";
import { XsrfInterceptor } from "./interceptors/xsrf.interceptor";
import { JalaliDatePipe } from '@app/core/pipes/jalali-date.pipe';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,

    // third party
    SnotifyModule,
    DpDatePickerModule,
    SlimLoadingBarModule.forRoot(),

  ],
  declarations: [
    JalaliDatePipe,
  ],
  providers: [


    AppConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: init,
      multi: true,
      deps: [AppConfigService]
    },


    { provide: 'SnotifyToastConfig', useValue: ToastDefaults },
    SnotifyService,



    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi: true
    },

    {
      provide: HTTP_INTERCEPTORS,
      useClass: XsrfInterceptor,
      multi: true
    },


    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi: true
    },

    { provide: ErrorHandler, useClass: AppErrorHandler },


    NotifyService,
    BrowserStorageService,
    // BaseService,
    // BaseComboService,
    // BaseKendoGridService,
    UtilsService,
    RefreshTokenService,
    TokenStoreService,
    AuthService,
    AuthGuard,




  ],
  exports: [
    // third party
    SnotifyModule,
    DpDatePickerModule,

    JalaliDatePipe,



  ]
})
export class CoreModule {
  static injector: Injector;

  constructor(injector: Injector) {
    CoreInjector.injector = injector;
  }
}



export function init(config: AppConfigService) {
  return () => {
    return config.load();
  };
}

