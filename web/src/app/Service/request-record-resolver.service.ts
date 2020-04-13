import { Injectable } from "@angular/core";
import { Resolve } from '@angular/router';
import { Record } from '../data/Record';
import { RequestService } from './request.service';


@Injectable()
export class RequestRecordResolver implements Resolve<Record> {

  constructor(
    private requester: RequestService
  ) { }

  resolve(route: import("@angular/router").ActivatedRouteSnapshot,
          state: import("@angular/router").RouterStateSnapshot
        ): Record | import("rxjs").Observable<Record> | Promise<Record> {
    return this.requester.getRecord(route.params['runs-id']);
  }

}
