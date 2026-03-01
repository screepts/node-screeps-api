import { readFile } from "fs/promises"
import { join } from "path"
import yaml from "js-yaml"

/**
 * Unified Credentials File v1.0.
 * A standardized format for storing credentials and configuration for Screeps World related tools.
 * @link https://github.com/screepers/screepers-standards/blob/master/SS3-Unified_Credentials_File.md
 */
export interface UnifiedConfig {
  servers: Partial<Record<string, ServerConfig>>
  configs?: Partial<Record<string, any>>
  [metadata: string]: any
}
interface ServerConfig {
  host: string
  /** override standard TCP port */
  port?: number
  /** use SSL */
  secure?: boolean
  /** authorization token */
  token?: string
  /** is only supported on private servers */
  username?: string
  /** is only supported on private servers */
  password?: string
  /** additional metadata like ptr flag */
  [metadata: string]: any
}

export class ConfigManager {
  path?: string
  private _config: UnifiedConfig | null = null

  async refresh() {
    this._config = null
    await this.getConfig()
  }

  async getServers() {
    const conf = await this.getConfig()
    return conf ? Object.keys(conf.servers) : []
  }

  async getConfig() {
    if (this._config) {
      return this._config
    }

    const paths = []
    if (process.env.SCREEPS_CONFIG) {
      paths.push(process.env.SCREEPS_CONFIG)
    }
    const dirs = ["", import.meta.dirname]
    for (const dir of dirs) {
      paths.push(join(dir, ".screeps.yaml"))
      paths.push(join(dir, ".screeps.yml"))
    }
    if (process.platform === "win32" && process.env.APPDATA) {
      paths.push(join(process.env.APPDATA, "screeps/config.yaml"))
      paths.push(join(process.env.APPDATA, "screeps/config.yml"))
    } else {
      if (process.env.XDG_CONFIG_HOME) {
        paths.push(join(process.env.XDG_CONFIG_HOME, "screeps/config.yaml"))
        paths.push(join(process.env.XDG_CONFIG_HOME, "screeps/config.yml"))
      }
      if (process.env.HOME) {
        paths.push(join(process.env.HOME, ".config/screeps/config.yaml"))
        paths.push(join(process.env.HOME, ".config/screeps/config.yml"))
        paths.push(join(process.env.HOME, ".screeps.yaml"))
        paths.push(join(process.env.HOME, ".screeps.yml"))
      }
    }

    for (const path of paths) {
      const data = await this.loadConfig(path)
      if (data) {
        if (typeof data !== "object" || !("servers" in data)) {
          throw new Error(`Invalid config: 'servers' object does not exist in '${path}'`)
        }
        this._config = data as UnifiedConfig
        this.path = path
        return this._config
      }
    }
    return null
  }

  async loadConfig(path: string) {
    try {
      const contents = await readFile(path, "utf8")
      return yaml.load(contents)
    } catch (e: unknown) {
      if ((e as { code?: string }).code === "ENOENT") {
        return false
      } else {
        throw e
      }
    }
  }
}
