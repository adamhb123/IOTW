export declare namespace Enums {
    enum SortedBy {
        Updoots = "updoots",
        Downdoots = "downdoots",
        UploaderID = "uploaderID",
        CSHUsername = "cshUsername",
        DootDifference = "dootDifference",
        AbsoluteDootDifference = "absoluteDootDifference"
    }
    enum Direction {
        Ascending = "ascending",
        Descending = "descending"
    }
}
export declare namespace Interfaces {
    interface UploadsResponseStructure {
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
export declare namespace Types { }
export declare namespace Methods {
    const reqMsg: (varName: string) => string;
    const parseEnvVar: (failureDefault: any, ...possibleEnvVarNames: string[]) => any;
    const pathJoin: (...parts: any[]) => string;
    const addEventListeners: (types: string[], callbacks: EventListener | EventListener[]) => void;
    const mousePositionFromEvent: (evt: Event) => [number, number] | void;
    const sortedByToString: (sortedBy: Enums.SortedBy | string) => string;
    const directionToString: (direction: Enums.Direction | string) => string;
    const directionEnumToSQL: (input: Enums.Direction) => "ASC" | "DESC";
}
