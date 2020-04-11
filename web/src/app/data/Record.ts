// To parse this data:
//
//   import { Convert } from "./file";
//
//   const records = Convert.toRecords(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface Record {
  categoryID:        string;
  primaryCategoryID: string;
  game:              Game;
  categoryName:      string;
  subcategoryName:   string;
  bestPlayers:       BestPlayer[];
  bestTime:          string;
  bestDate:          Date;
  bestVideoLink:     string;
  bestComment:       string;
  lastUpdated:       Date;
}

export interface BestPlayer {
  playerID:      string;
  playerName:    string;
  countryName:   string;
  twitch:        string;
  hitbox:        string;
  youtube:       string;
  twitter:       string;
  speedrunslive: string;
  isGuest:       boolean;
}

export interface Game {
  gameID:          string;
  gameTitle:       string;
  activePlayerNum: number;
  lastUpdated:     Date;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class RecordConverter {
  public static toRecords(json: string): Record[] {
      return cast(JSON.parse(json), a(r("Records")));
  }

  public static recordsToJson(value: Record[]): string {
      return JSON.stringify(uncast(value, a(r("Records"))), null, 2);
  }
}

function invalidValue(typ: any, val: any): never {
  throw Error(`Invalid value ${JSON.stringify(val)} for type ${JSON.stringify(typ)}`);
}

function jsonToJSProps(typ: any): any {
  if (typ.jsonToJS === undefined) {
      var map: any = {};
      typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
      typ.jsonToJS = map;
  }
  return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
  if (typ.jsToJSON === undefined) {
      var map: any = {};
      typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
      typ.jsToJSON = map;
  }
  return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any): any {
  function transformPrimitive(typ: string, val: any): any {
      if (typeof typ === typeof val) return val;
      return invalidValue(typ, val);
  }

  function transformUnion(typs: any[], val: any): any {
      // val must validate against one typ in typs
      var l = typs.length;
      for (var i = 0; i < l; i++) {
          var typ = typs[i];
          try {
              return transform(val, typ, getProps);
          } catch (_) {}
      }
      return invalidValue(typs, val);
  }

  function transformEnum(cases: string[], val: any): any {
      if (cases.indexOf(val) !== -1) return val;
      return invalidValue(cases, val);
  }

  function transformArray(typ: any, val: any): any {
      // val must be an array with no invalid elements
      if (!Array.isArray(val)) return invalidValue("array", val);
      return val.map(el => transform(el, typ, getProps));
  }

  function transformDate(typ: any, val: any): any {
      if (val === null) {
          return null;
      }
      const d = new Date(val);
      if (isNaN(d.valueOf())) {
          return invalidValue("Date", val);
      }
      return d;
  }

  function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
      if (val === null || typeof val !== "object" || Array.isArray(val)) {
          return invalidValue("object", val);
      }
      var result: any = {};
      Object.getOwnPropertyNames(props).forEach(key => {
          const prop = props[key];
          const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
          result[prop.key] = transform(v, prop.typ, getProps);
      });
      Object.getOwnPropertyNames(val).forEach(key => {
          if (!Object.prototype.hasOwnProperty.call(props, key)) {
              result[key] = transform(val[key], additional, getProps);
          }
      });
      return result;
  }

  if (typ === "any") return val;
  if (typ === null) {
      if (val === null) return val;
      return invalidValue(typ, val);
  }
  if (typ === false) return invalidValue(typ, val);
  while (typeof typ === "object" && typ.ref !== undefined) {
      typ = typeMap[typ.ref];
  }
  if (Array.isArray(typ)) return transformEnum(typ, val);
  if (typeof typ === "object") {
      return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
          : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
          : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
          : invalidValue(typ, val);
  }
  // Numbers can be parsed by Date but shouldn't be.
  if (typ === Date && typeof val !== "number") return transformDate(typ, val);
  return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
  return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
  return transform(val, typ, jsToJSONProps);
}

function a(typ: any) {
  return { arrayItems: typ };
}

function u(...typs: any[]) {
  return { unionMembers: typs };
}

function o(props: any[], additional: any) {
  return { props, additional };
}

function m(additional: any) {
  return { props: [], additional };
}

function r(name: string) {
  return { ref: name };
}

const typeMap: any = {
  "Records": o([
      { json: "category_id", js: "categoryID", typ: "" },
      { json: "primary_category_id", js: "primaryCategoryID", typ: "" },
      { json: "game", js: "game", typ: r("Game") },
      { json: "category_name", js: "categoryName", typ: "" },
      { json: "subcategory_name", js: "subcategoryName", typ: "" },
      { json: "best_players", js: "bestPlayers", typ: a(r("BestPlayer")) },
      { json: "best_time", js: "bestTime", typ: "" },
      { json: "best_date", js: "bestDate", typ: Date },
      { json: "best_video_link", js: "bestVideoLink", typ: "" },
      { json: "best_comment", js: "bestComment", typ: "" },
      { json: "last_updated", js: "lastUpdated", typ: Date },
  ], false),
  "BestPlayer": o([
      { json: "player_id", js: "playerID", typ: "" },
      { json: "player_name", js: "playerName", typ: "" },
      { json: "country_name", js: "countryName", typ: "" },
      { json: "twitch", js: "twitch", typ: "" },
      { json: "hitbox", js: "hitbox", typ: "" },
      { json: "youtube", js: "youtube", typ: "" },
      { json: "twitter", js: "twitter", typ: "" },
      { json: "speedrunslive", js: "speedrunslive", typ: "" },
      { json: "is_guest", js: "isGuest", typ: true },
  ], false),
  "Game": o([
      { json: "game_id", js: "gameID", typ: "" },
      { json: "game_title", js: "gameTitle", typ: "" },
      { json: "active_player_num", js: "activePlayerNum", typ: 0 },
      { json: "last_updated", js: "lastUpdated", typ: Date },
  ], false),
};
