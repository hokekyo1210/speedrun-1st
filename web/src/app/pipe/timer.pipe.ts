import { Pipe, PipeTransform } from '@angular/core';
import {sprintf} from "sprintf-js";

@Pipe({ name: 'timer' })
export class TimerPipe implements PipeTransform {
  transform(value: string, ...args: any[]) {
    let num = Number(value);

    const hh = Math.floor(num/3600);
    num %= 3600;
    const mm = Math.floor(num/60);
    num %= 60;
    const ss = num;

    const res = sprintf("%02d:%02d:%06.3f", hh, mm, ss);

    return res;
  }

}
