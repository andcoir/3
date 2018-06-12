import { Injector, Injectable } from '@angular/core';

export class CoreInjector {
    static injector: Injector;

    constructor(injector: Injector) {
        CoreInjector.injector = injector;
    }
}

