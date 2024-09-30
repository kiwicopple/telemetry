import { NodeSDK } from 'npm:@opentelemetry/sdk-node'
import { OTLPTraceExporter } from 'npm:@opentelemetry/exporter-trace-otlp-http'
import { getNodeAutoInstrumentations } from 'npm:@opentelemetry/auto-instrumentations-node'
import { Resource } from 'npm:@opentelemetry/resources'
import { SemanticResourceAttributes } from 'npm:@opentelemetry/semantic-conventions'
import { trace } from 'npm:@opentelemetry/api'

// Async IIFE for setup
;(async () => {
  try {
    // Setup resource attributes to avoid async initialization
    const resource = new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: 'example-service',
      [SemanticResourceAttributes.SERVICE_VERSION]: '1.0.0',
      [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: 'production',
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
