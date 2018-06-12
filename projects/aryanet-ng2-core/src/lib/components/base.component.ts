import {
    OnInit,
    AfterViewInit, OnChanges, SimpleChanges
} from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';



import { NotifyService } from '../services/notify.service';
import { BrowserStorageService } from '../services/browser-storage.service';
import { CoreInjector } from '../core.injector';

export abstract class BaseComponent implements OnInit, AfterViewInit, OnChanges {

    datePickerConfig = {
        drops: 'down', // up,down
        format: 'jYYYY/jMM/jDD',
        //  format: 'LL', // 15 آبان 1396
        // format: 'YYYY/MM/DD',
        locale: 'fa',
        calendarSystem: 0,

        // hours12Format?: string;
        // hours24Format?: string;
        // maxTime?: Moment;
        // meridiemFormat?: string;
        // minTime?: Moment;
        // minutesFormat?: string;
        // minutesInterval?: number;
        // secondsFormat?: string;
        // secondsInterval?: number;
        // showSeconds?: boolean;
        // showTwentyFourHours?: boolean;
        // timeSeparator?: string;
        // calendarSystem?: ECalendarSystem;
        // isMonthDisabledCallback?: (date: Moment) => boolean;
        // allowMultiSelect?: boolean;
        // yearFormat?: string;
        // calendarSystem?: ECalendarSystem;
        // yearFormatter?: (month: Moment) => string;
        // format?: string;
        // isNavHeaderBtnClickable?: boolean;
        // monthBtnFormat?: string;
        // monthBtnFormatter?: (day: Moment) => string;
        // multipleYearsNavigateBy?: number;
        // showMultipleYearsNavigation?: boolean;
        // isDayDisabledCallback?: (date: Moment) => boolean;
        // isMonthDisabledCallback?: (date: Moment) => boolean;
        // weekDayFormat?: string;
        // showNearMonthDays?: boolean;
        // showWeekNumbers?: boolean;
        // firstDayOfWeek?: WeekDays;
        // calendarSystem?: ECalendarSystem;
        // format?: string;
        // allowMultiSelect?: boolean;
        // monthFormat?: string;
        // monthFormatter?: (month: Moment) => string;
        // enableMonthSelector?: boolean;
        // yearFormat?: string;
        // yearFormatter?: (year: Moment) => string;
        // dayBtnFormat?: string;
        // dayBtnFormatter?: (day: Moment) => string;
        // monthBtnFormat?: string;
        // monthBtnFormatter?: (day: Moment) => string;
        // multipleYearsNavigateBy?: number;
        // showMultipleYearsNavigation?: boolean;
        // closeOnSelect?: boolean;
        // closeOnSelectDelay?: number;
        // onOpenDelay?: number;
        // disableKeypress?: boolean;
        // appendTo?: string | HTMLElement;
        // inputElementContainer?: HTMLElement;
        // showGoToCurrent?: boolean;
        // drops?: TDrops;
        // opens?: TOpens;
        // hideInputContainer?: boolean;
    };

    notify: NotifyService;
    storageService: BrowserStorageService;

    constructor() {
        this.notify = CoreInjector.injector.get(NotifyService);
        this.storageService = CoreInjector.injector.get(BrowserStorageService);
    }

    ngOnInitHandler() { }
    ngOnInit() {
        this.ngOnInitHandler();
    }

    ngAfterViewInitHandler() { }
    ngAfterViewInit(): void {
        this.ngAfterViewInitHandler();
    }

    ngOnChangesHandler(changes: SimpleChanges) { }
    ngOnChanges(changes: SimpleChanges): void {
        this.ngOnChangesHandler(changes);
    }


}


export abstract class BaseTreeComponent extends BaseComponent {

    treeSettings = {
        rootIsVisible: true
    };


    abstract ngOnInitHandler();

}





export abstract class BaseControlValueAccessor implements ControlValueAccessor, OnInit {

    ngOnInitHandler() { }
    ngOnInit() {
        this.ngOnInitHandler();
    }


    abstract writeValue(obj: any): void;
    registerOnChange(fn: any): void {
        this.propagateChange = fn;
    }
    registerOnTouched(): void {

    }
    setDisabledState?(): void {

    }

    propagateChange = (_: any) => { };


    onChange(r) {

        this.propagateChange(r);
        // this.valueChanged.emit(value);
    }
}



