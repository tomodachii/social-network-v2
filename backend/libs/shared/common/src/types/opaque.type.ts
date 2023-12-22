/**
 * Opaque type aliases provide type abstraction without any overhead
 * 
 * Usage:
 * 
 * type UserLocation = Opaque<string, 'UserLocation'>
 * 
 * const us: UserLocation = "United State" -> This cause compiler error
 * 
 * const us: UserLocation = "United State" as UserLocation
 */
export type Opaque<T, K> = T & { __opaque__: K };
