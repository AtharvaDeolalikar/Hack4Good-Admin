import _get from "lodash/get";
import { TABLE_GROUP_SCHEMAS, TABLE_SCHEMAS } from "config/dbPaths";

/**
 * reposition an element in an array
 * @param arr array
 * @param old_index index of element to be moved
 * @param new_index new position of the moved element
 */
export const arrayMover = (
  arr: any[],
  old_index: number,
  new_index: number
) => {
  while (old_index < 0) {
    old_index += arr.length;
  }
  while (new_index < 0) {
    new_index += arr.length;
  }
  if (new_index >= arr.length) {
    var k = new_index - arr.length + 1;
    while (k--) {
      arr.push(undefined);
    }
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
  return arr; // for testing purposes
};

export const missingFieldsReducer =
  (data: any) => (acc: string[], curr: string) => {
    if (data[curr] === undefined) {
      return [...acc, curr];
    } else return acc;
  };

export const sanitiseCallableName = (name: string) => {
  if (!name || typeof name !== "string") return "";
  return name
    .replace("callable-", "")
    .replace(/([^A-Z])([A-Z])/g, "$1 $2")
    .replace(/([A-Z])(?=[a-z])/g, " $1");
};

export const isUrl = (str: string) => {
  const regex = new RegExp(
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi
  );
  return regex.test(str);
};

/**
 * Removes NaN from object so it can be serialised as Cloud Function input
 * @param rowData
 */
export const sanitiseRowData = (rowData: any) => {
  Object.keys(rowData).forEach((key) => {
    if (rowData[key] && typeof rowData[key] === "object")
      sanitiseRowData(rowData[key]);
    else if (typeof rowData[key] === "number" && isNaN(rowData[key]))
      delete rowData[key];
  });
  return rowData;
};

export const isCollectionGroup = () => {
  const pathName = window.location.pathname.split("/")[1];
  return pathName === "tableGroup";
};
var characters =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
export function makeId(length) {
  var result = "";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export const generateSmallerId = (id: string) => {
  const indexOfFirstChar = characters.indexOf(id[0]);
  if (indexOfFirstChar !== 0)
    return characters[indexOfFirstChar - 1] + makeId(id.length - 1);
  else return id[0] + generateSmallerId(id.substr(1, id.length - 1));
};

export const generateBiggerId = (id: string) => {
  const indexOfFirstChar = characters.indexOf(id[0]);
  if (indexOfFirstChar !== 61)
    return characters[indexOfFirstChar + 1] + makeId(id.length - 1);
  else return id[0] + generateBiggerId(id.substr(1, id.length - 1));
};

// Gets sub-table ID in $1
const formatPathRegex = /\/[^\/]+\/([^\/]+)/g;

export const formatPath = (tablePath: string) => {
  return `${
    isCollectionGroup() ? TABLE_GROUP_SCHEMAS : TABLE_SCHEMAS
  }/${tablePath.replace(formatPathRegex, "/subTables/$1")}`;
};

export const formatSubTableName = (tablePath) =>
  tablePath
    ? tablePath.replace(formatPathRegex, "/subTables/$1").replace(/\//g, "_")
    : null;

export async function asyncForEach(array: any[], callback: Function) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

export const getCellValue = (row: Record<string, any>, key: string) => {
  if (key.includes(".")) return _get(row, key);
  return row[key];
};

export function flattenObject(ob) {
  var toReturn = {};

  for (var i in ob) {
    if (!ob.hasOwnProperty(i)) continue;

    if (typeof ob[i] == "object" && ob[i] !== null) {
      var flatObject = flattenObject(ob[i]);
      for (var x in flatObject) {
        if (!flatObject.hasOwnProperty(x)) continue;

        toReturn[i + "." + x] = flatObject[x];
      }
    } else {
      toReturn[i] = ob[i];
    }
  }
  return toReturn;
}

export const deepMerge = (target, source) => {
  for (const key in source) {
    if (source[key] && typeof source[key] === "object") {
      if (!target[key]) target[key] = {};
      deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
};

export const rowyUser = (
  currentUser: firebase.default.User,
  data?: Record<string, any>
) => {
  const { displayName, email, uid, emailVerified, isAnonymous, photoURL } =
    currentUser;

  return {
    timestamp: new Date(),
    displayName,
    email,
    uid,
    emailVerified,
    isAnonymous,
    photoURL,
    ...data,
  };
};
