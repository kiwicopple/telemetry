import TelemetryClient, { TelemetryOptions } from './TelemetryClient'

export const createClient = (options: TelemetryOptions) => {
  return new TelemetryClient(options)
}

export type { TelemetryOptions }
