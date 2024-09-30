const { NodeSDK } = require('@opentelemetry/sdk-node')
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http')
const {
  getNodeAutoInstrumentations,
} = require('@opentelemetry/auto-instrumentations-node')
const { Resource } = require('@opentelemetry/resources')

;(async () => {
  try {
    // Setup resource attributes to avoid async initialization
    const resource = new Resource({
      'service.name': 'your-service-name',
      'service.version': '1.0.0',
      'service.environment': 'production',
    })

    const traceExporter = new OTLPTraceExporter({
      url: 'http://127.0.0.1:55680/v1/traces',
    })

    const sdk = new NodeSDK({
      traceExporter,
      instrumentations: [getNodeAutoInstrumentations()],
      resource, // Use the explicit resource attributes
    })

    // Start the SDK
    await sdk.start()

    // Example of creating a manual span
    const { trace } = require('@opentelemetry/api')
    const tracer = trace.getTracer('example-tracer')

    for (let i = 1; i <= 10; i++) {
      const span = tracer.startSpan(`example-operation-${i}`)

      span.addEvent(`Start processing span ${i}`)
      await new Promise((resolve) => setTimeout(resolve, 100))
      span.addEvent(`Finished processing span ${i}`)

      span.end()
    }

    // Ensure the spans are exported before shutting down
    setTimeout(async () => {
      await sdk.shutdown()
      console.log('SDK shutdown: check http://localhost:55679/debug/tracez')
    }, 2000)
  } catch (error) {
    console.error('Error:', error)
  }
})()
