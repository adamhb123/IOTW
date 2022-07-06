// Definition of "primitive" is loose here
export type PrimitiveTypeString =
  | "boolean"
  | "number"
  | "bigint"
  | "string"
  | "symbol"
  | "object";

export const stringToPrimitive = (
  string: string,
  desiredPrimitive: PrimitiveTypeString
) => {
  return {
    boolean: () => (string === "true" ? true : false),
    number: () => Number(string),
    bigint: () => BigInt(string),
    string: () => string,
    symbol: () => Symbol(string),
    object: () => JSON.parse(string),
  }[desiredPrimitive]();
};

export const pathJoin = (...parts: any[]) =>
  parts.join("/").replace(new RegExp(`^/(?!//)([/{1,}]+)$`, "g"), "/");
