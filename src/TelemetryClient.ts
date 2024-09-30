import { NodeSDK } from '@opentelemetry/sdk-node'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'
import { trace, Tracer, Span } from '@opentelemetry/api'
import { Resource } from '@opentelemetry/resources'

export type TelemetryOptions = {
  collectors: string[]
  logs: {
    level: string
  }
  traces: {}
  metrics: {}
}

export default class TelemetryClient {
  protected options: TelemetryOptions = {
    collectors: ['http://127.0.0.1:55680/v1/traces'],
    logs: {
      level: 'info',
    },
    traces: {},
    metrics: {},
  }
  private sdk: NodeSDK
  private rootTracer: Tracer
  private rootSpan: Span | null = null // Long-running span

  constructor(options: TelemetryOptions) {
    this.options = options

    const traceExporter = new OTLPTraceExporter({
      url: 'http://127.0.0.1:55680/v1/traces',
    })

    const resource = new Resource({
      'service.name': 'your-service-name',
      'service.version': '1.0.0',
      'service.environment': 'production',
    })

    this.sdk = new NodeSDK({
      traceExporter,
      instrumentations: [getNodeAutoInstrumentations()],
      resource,
    })

    this.init()
  }

  async init() {
    await this.sdk.start()
    this.rootTracer = trace.getTracer('root-tracer')
    this.rootSpan = this.rootTracer.startSpan(`root-span`, {
      kind: 1, // Internal Span
    })
  }

  log(message: string) {
    console.log(message)
    this.rootSpan?.addEvent(message, { 'log.level': 'info' })
  }

  error(message: string) {
    console.error(message)
    this.rootSpan?.addEvent(message, { 'log.level': 'error' })
  }

  warn(message: string) {
    console.warn(message)
    this.rootSpan?.addEvent(message, { 'log.level': 'warn' })
  }
}
