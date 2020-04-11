import { Pipe, PipeTransform } from '@angular/core';
import {sprintf} from "sprintf-js";

@Pipe({ name: 'timer' })
export class TimerPipe implements PipeTransform {
  transform(value: string, ...args: any[]) {
    console.log(value);
    let num = Number(value);
    console.log(num);

    const hh = Math.floor(num/3600);
    num %= 3600;
    const mm = Math.floor(num/60);
    num %= 60;
    const ss = num;

    console.log(hh);
    console.log(mm);
    console.log(ss);

    const res = sprintf("%02d:%02d:%05.2f", hh, mm, ss);
    console.log(res);
    return res;
  }

}
