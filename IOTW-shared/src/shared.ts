export namespace Enums {
  export enum SortedBy {
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
}

export namespace Interfaces {
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
}

export namespace Types {}

// Definition of "primitive" is loose here
type PrimitiveTypeString =
  | "boolean"
  | "number"
  | "bigint"
  | "string"
  | "symbol"
  | "object";

const stringToPrimitive = (
  string: string,
  desiredPrimitive: PrimitiveTypeString
) => {
  return {
    boolean: () => string === "true",
    number: () => Number(string),
    bigint: () => BigInt(string),
    string: () => string,
    symbol: () => Symbol(string),
    object: () => JSON.parse(string),
  }[desiredPrimitive]();
};

export namespace Methods {
  export const reqMsg = (varName: string) =>
    `${varName} required, please configure your environment variables`;

  export const parseEnvVar = (
    failureDefault: any,
    ...possibleEnvVarNames: string[]
  ) => {
    const desiredPrimitive = <PrimitiveTypeString>typeof failureDefault;
    for (const envVarName of possibleEnvVarNames) {
      const envVar = process.env[envVarName];
      if (typeof envVar !== "undefined") {
        console.log(envVar);
        return stringToPrimitive(envVar, desiredPrimitive);
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
      if (types.length !== callbacks.length)
        throw new Error(
          "Length of types and length of callback provided to Utility.addEventListeners not equal"
        );
      for (let i = 0; i < types.length; i++)
        document.addEventListener(types[i], callbacks[i]);
    } else {
      if (Array.isArray(callbacks)) callbacks = callbacks[0];
      for (const type of types)
        document.addEventListener(type, callbacks as EventListener);
    }
  };

  export const mousePositionFromEvent = (
    evt: Event
  ): [number, number] | void => {
    if (evt.type.includes("mouse")) {
      return [(evt as MouseEvent).clientX, (evt as MouseEvent).clientY];
    } else if (evt.type.includes("touch")) {
      const touch =
        (evt as TouchEvent).touches[0] || (evt as TouchEvent).changedTouches[0];
      return [touch.pageX, touch.pageY];
    }
  };

  export const sortedByToString = (sortedBy: Enums.SortedBy | string) => {
    if (sortedBy === Enums.SortedBy.CSHUsername) return "CSH Username";
    else if (sortedBy === Enums.SortedBy.UploaderID) return "Uploader ID";
    return sortedBy
      .split(/(?=[A-Z])/)
      .map((str) => str[0].toUpperCase() + str.substring(1, str.length))
      .join(" ");
  };

  export const directionToString = (direction: Enums.Direction | string) =>
    direction[0].toUpperCase() + direction.substring(1, direction.length);

  export const directionEnumToSQL = (input: Enums.Direction) =>
    input === "ascending" ? "ASC" : input === "descending" ? "DESC" : "DESC";
}
