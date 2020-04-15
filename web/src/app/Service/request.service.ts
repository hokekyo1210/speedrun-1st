import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient } from '@angular/common/http';

import { environment } from './../../environments/environment';

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
  private readonly HOST = environment.apiHost;

  constructor(private http: HttpClient) { }

  private errorHandler(err): Promise<never> {
    return Promise.reject(err.message || err);
  }

  /**
   * RecordsのHTTP/GETメソッド
   * @param max
   * @param offset
   */
  public getRecords(max: number, offset: number): Promise<Record[]> {
    return this.getRequest(
      "v1/records",
      new Map([
        ["max", max.toString()],
        ["offset", offset.toString()],
        ["orderby", "best_verify_date"],
        ["direction", "desc"],
      ]),
      RecordConverter.toRecord
    );
  }

  /**
   * Recordの取得
   * テスト実装
   * @param categoryId
   */
  public getRecord(primaryCategoryId: string, categoryId: string): Promise<Record>{
    return this.getRequest(
      "v1/records/" + primaryCategoryId,
      null,
      RecordConverter.toRecord
    ).then(
      records => {
        // カテゴリIDで取得した記録配列からプライマリIDを使って検索
        for (const record of records) {
          if(record.categoryID == categoryId){
            return record;
          }
        }
        // 見つからなかったら1番目を返す
        return records[0];
      }
    );
  }

  private getRequest<T>(path: string, parm: Map<string, string>, toObject: (string) => T[] ): Promise<T[]> {
    const url = new URL(this.HOST);
    url.pathname = path;
    if(parm != null) {
      parm.forEach( (v, k) => url.searchParams.set(k, v) );
    }

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
