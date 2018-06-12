import { PipeTransform, Pipe } from "@angular/core";
import * as momentJalaali from "moment-jalaali";


@Pipe({ name: 'jalaliDate' })
export class JalaliDatePipe implements PipeTransform {

    transform(value: any, ...args: any[]) {

        if (args == undefined || args.length == 0)
            return momentJalaali(value).format('jYYYY/jMM/jDD');

        return momentJalaali(value).format(args[0]);
        // <span dir="ltr">{{date | jalaliDate:'jYYYY/jMM/jDD hh:mm' }}</span>,
        // <span dir="rtl">{{date | jalaliDate:'jD jMMMM jYYYY [ساعت] LT'}}</span>




        // if (value !== undefined &&
        //     value !== null)
        //     return moment(value, 'YYYY/MM/DD').format('jYYYY/jM/jD');

        // return '';
    }

}

