export function jsonSafe<T>(value: T): unknown {
  return JSON.parse(JSON.stringify(value, (_, item: unknown) => typeof item === "bigint" ? item.toString() : item)) as unknown;
}
