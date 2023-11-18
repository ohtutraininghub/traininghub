export function assertNever(value: never) {
  throw new Error(`Invalid discriminated union member: ${value}`);
}
