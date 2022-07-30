import React from "react";

export interface UploadDisplayDOM extends Document {
  userDragging?: boolean;
  restrictClicks?: boolean;
  uploadFullOverlayVisible?: boolean;
  uploadFullOverlayDootDifference?: number;
  setUploadFullOverlaySrc?: React.Dispatch<React.SetStateAction<string>>;
  setUploadFullOverlayVisible?: React.Dispatch<React.SetStateAction<boolean>>;
  setUploadFullOverlayDootDifference?: React.Dispatch<React.SetStateAction<number>>;
  uploadFetch?: (
    sortedBy?: UploadColumnID,
    direction?: Direction
  ) => Promise<void>;
  currentMousePosition?: [number, number];
}

export type DataTypeString =
  | "boolean"
  | "number"
  | "bigint"
  | "string"
  | "symbol"
  | "object";

export const isDataTypeString = (x: unknown): x is DataTypeString =>
  typeof x === "string" &&
  ["boolean", "number", "bigint", "string", "symbol", "object"].includes(x);

export const stringToDataType = (
  string: string,
  desiredDataType: DataTypeString
) => {
  return {
    boolean: () => string === "true",
    number: () => Number(string),
    bigint: () => BigInt(string),
    string: () => string,
    symbol: () => Symbol(string),
    object: () => JSON.parse(string),
  }[desiredDataType]();
};

export interface ValidatableProperty {
  name: string;
  type: DataTypeString;
}

export const ValidatableProperty = (name: string, type: DataTypeString) => ({
  name: name,
  type: type,
});

export const isValidatableProperty = (x: unknown): x is ValidatableProperty => {
  const prop = <ValidatableProperty>x;
  return (
    typeof prop.name === "string" &&
    typeof prop.type === "string" &&
    isDataTypeString(prop.type)
  );
};
export const typeguardValidator = (
  validatee: unknown,
  propertiesToValidate: ValidatableProperty | ValidatableProperty[]
): boolean => {
  const props = Array.isArray(propertiesToValidate)
    ? propertiesToValidate
    : [propertiesToValidate];
  for (const prop of props) {
    if (
      !(
        isValidatableProperty(prop) &&
        Object.prototype.hasOwnProperty.call(validatee, prop.name)
      )
    )
      return false;
  }
  return true;
};

export enum UploadColumnID {
  Updoots = "updoots",
  Downdoots = "downdoots",
  UploaderID = "uploaderID",
  CSHUsername = "cshUsername",
  DootDifference = "dootDifference",
  AbsoluteDootDifference = "absoluteDootDifference",
}

export enum Direction {
  Ascending = "ascending",
  Descending = "descending",
}

export interface UploadsResponseStructure {
  id: string;
  uploaderID: string;
  cshUsername: string;
  apiPublicFileUrl: string;
  imageUrl: string;
  imageMimetype: string;
  thumbnailUrl: string;
  thumbnailMimetype: string;
  updoots: number;
  downdoots: number;
  dootDifference: number;
  absoluteDootDifference: number;
}

export const isUploadsResponseStructure = (
  x: unknown
): x is UploadsResponseStructure => {
  return typeguardValidator(x, [
    ValidatableProperty("id", "string"),
    ValidatableProperty("uploaderID", "string"),
    ValidatableProperty("cshUsername", "string"),
    ValidatableProperty("apiPublicFileUrl", "string"),
    ValidatableProperty("imageUrl", "string"),
    ValidatableProperty("imageMimetype", "string"),
    ValidatableProperty("thumbnailUrl", "string"),
    ValidatableProperty("thumbnailMimetype", "string"),
    ValidatableProperty("updoots", "number"),
    ValidatableProperty("downdoots", "number"),
    ValidatableProperty("dootDifference", "number"),
    ValidatableProperty("absoltueDootDifference", "number"),
  ]);
};
export const reqMsg = (varName: string) =>
  `${varName} required, please configure your environment variables`;

export const parseEnvVar = (
  failureDefault: any,
  ...possibleEnvVarNames: string[]
) => {
  const desiredData = <DataTypeString>typeof failureDefault;
  for (const envVarName of possibleEnvVarNames) {
    const envVar = process.env[envVarName];
    if (typeof envVar !== "undefined") {
      return stringToDataType(envVar, desiredData);
    }
  }
  return failureDefault;
};

export const pathJoin = (...parts: any[]) =>
  parts.join("/").replace(new RegExp(`^/(?!//)([/{1,}]+)$`, "g"), "/");

export const addEventListeners = (
  types: string[],
  callbacks: EventListener | EventListener[]
) => {
  if (Array.isArray(callbacks) && callbacks.length > 1) {
    if (types.length !== callbacks.length) {
      throw new Error(
        "Length of types and length of callback provided to Utility.addEventListeners not equal"
      );
    }
    for (let i = 0; i < types.length; i++)
      document.addEventListener(types[i], callbacks[i]);
  } else {
    if (Array.isArray(callbacks)) callbacks = callbacks[0];
    for (const type of types)
      document.addEventListener(type, callbacks as EventListener);
  }
};

export const mousePositionFromEvent = (evt: Event): [number, number] | void => {
  if (evt.type.includes("mouse")) {
    return [(evt as MouseEvent).clientX, (evt as MouseEvent).clientY];
  } else if (evt.type.includes("touch")) {
    const touch =
      (evt as TouchEvent).touches[0] || (evt as TouchEvent).changedTouches[0];
    return [touch.pageX, touch.pageY];
  }
};

export const uploadColumnIDToString = (
  uploadColumnID: UploadColumnID | string
) => {
  if (uploadColumnID === UploadColumnID.CSHUsername) return "CSH Username";
  else if (uploadColumnID === UploadColumnID.UploaderID) return "Uploader ID";
  return uploadColumnID
    .split(/(?=[A-Z])/)
    .map((str) => str[0].toUpperCase() + str.substring(1, str.length))
    .join(" ");
};

export const directionToString = (direction: Direction | string) =>
  direction[0].toUpperCase() + direction.substring(1, direction.length);

export const directionEnumToSQL = (input: Direction) =>
  input === "ascending" ? "ASC" : input === "descending" ? "DESC" : "DESC";
