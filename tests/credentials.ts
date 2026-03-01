const auth = {
  username: "screeps-api-testing",
  password: "mG3r3TIRbDnSrraGnOdIQyBek1hfxu",
  protocol: "https",
  hostname: "server1.screepspl.us",
  port: 443,
}
export default auth

export const opts: Partial<typeof auth> = auth
delete opts.username
delete opts.password

export function objectKeys<T extends object>(obj: T) {
  return Object.keys(obj) as (keyof T)[]
}
