import React from "react";
export interface IOTWDOM extends Document {
    userDragging?: boolean;
    uploadFullOverlayVisible?: boolean;
    setUploadFullOverlaySrc?: React.Dispatch<React.SetStateAction<string>>;
    setUploadFullOverlayVisible?: React.Dispatch<React.SetStateAction<boolean>>;
    uploadFetch?: (sortedBy?: UploadColumnID, direction?: Direction) => Promise<void>;
    currentMousePosition?: [number, number];
}
export declare type DataTypeString = "boolean" | "number" | "bigint" | "string" | "symbol" | "object";
export declare const isDataTypeString: (x: unknown) => x is DataTypeString;
export declare const stringToDataType: (string: string, desiredDataType: DataTypeString) => any;
export interface ValidatableProperty {
    name: string;
    type: DataTypeString;
}
export declare const ValidatableProperty: (name: string, type: DataTypeString) => {
    name: string;
    type: DataTypeString;
};
export declare const isValidatableProperty: (x: unknown) => x is ValidatableProperty;
export declare const typeguardValidator: (validatee: unknown, propertiesToValidate: ValidatableProperty | ValidatableProperty[]) => boolean;
export declare enum UploadColumnID {
    Updoots = "updoots",
    Downdoots = "downdoots",
    UploaderID = "uploaderID",
    CSHUsername = "cshUsername",
    DootDifference = "dootDifference",
    AbsoluteDootDifference = "absoluteDootDifference"
}
export declare enum Direction {
    Ascending = "ascending",
    Descending = "descending"
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
export declare const isUploadsResponseStructure: (x: unknown) => x is UploadsResponseStructure;
export declare const reqMsg: (varName: string) => string;
export declare const parseEnvVar: (failureDefault: any, ...possibleEnvVarNames: string[]) => any;
export declare const pathJoin: (...parts: any[]) => string;
export declare const addEventListeners: (types: string[], callbacks: EventListener | EventListener[]) => void;
export declare const mousePositionFromEvent: (evt: Event) => [number, number] | void;
export declare const uploadColumnIDToString: (uploadColumnID: UploadColumnID | string) => string;
export declare const directionToString: (direction: Direction | string) => string;
export declare const directionEnumToSQL: (input: Direction) => "ASC" | "DESC";
