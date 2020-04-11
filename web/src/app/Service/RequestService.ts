import { Injectable } from "@angular/core";

import { HttpHeaders, HttpClient } from '@angular/common/http';

import { Record, RecordConverter } from "../data/Record";

@Injectable()
export class RequestService {

  /**
   * Httpクライアント用のヘッダーオプション
   */
  private httpOptions: Object = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    }),
    body: null
  };

  /**
   * API 実行対象のURL
   */
  private host: string = 'http://35.200.25.175';

  constructor(private http: HttpClient) { }

  private errorHandler(err): Promise<never> {
    return Promise.reject(err.message || err);
  }

  /**
   * RecordsのHTTP/GETメソッド
   * @param size
   * @param offset
   */
  public getRecords(size: number, offset: number): Promise<Record[]> {
    return this.getRequest(
      "v1/records",
      new Map([["size", size.toString()], ["offset", offset.toString()]]),
      RecordConverter.toRecords
    );
  }


  private getRequest<T>(path: string, parm: Map<string, string>, toObject: (string) => T[] ): Promise<T[]> {
    const url = new URL(this.host);
    url.pathname = path;
    parm.forEach( (v, k) => url.searchParams.set(k, v) );

    return this.http.get(url.toString(), this.httpOptions)
      .toPromise()
      .then((response) => {
        // 一旦、オブジェクトをJSON形式の文字列にして、変換
        const data = toObject(JSON.stringify(response));
        return data;
      })
      .catch(this.errorHandler);
  }

}
