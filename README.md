# `telemetry`

Important files/directories:

```bash
├── docker
│   ├── docker-compose.otel.yml  # The otel collector
│   ├── docker-compose.s3.yml
│   ├── docker-compose.yml
│   └── volumes
│       ├── api
│       ├── db
│       ├── functions
│       ├── logs
│       ├── otel                # This stores the otel config and data
│       └── storage
├── scripts
│   ├── gen.js
│   ├── generate.js             # Run this with node to generate some data
│   └── manual.js
├── src
│   ├── TelemetryClient.ts      # Basic client which re-maps to "supabase-like" DX
│   └── index.ts
├── tests
│   └── index.test.ts           # Some jest tests which 
└── tsconfig.json
```

Todo:

- [ ] I tried to get the OTel collector dumping into S3 (via Supabase Storage) but I couldn't get it working.
- [ ] Looks like Arrow is the [best format now](https://opentelemetry.io/blog/2024/otel-arrow-production/).


### Useful

Once it's running you can send data to the collector:

```bash
curl -X POST http://localhost:55680/v1/traces \
    -H 'Content-Type: application/json' \
    -d '{
        "resourceSpans": [{
            "resource": {
                "attributes": [{
                    "key": "service.name",
                    "value": {"stringValue": "my-service"}
                }]
            },
            "instrumentationLibrarySpans": [{
                "spans": [{
                    "traceId": "a3c67bc16b774f08a3ffdd5f903bbf1d",
                    "spanId": "ffa8e1b0c047ba64",
                    "name": "sample-span",
                    "kind": "SPAN_KIND_SERVER",
                    "startTimeUnixNano": 1645639822000000000,
                    "endTimeUnixNano": 1645639823000000000
                }]
            }]
        }]
    }'


curl -X POST http://localhost:55680/v1/metrics \
  -H 'Content-Type: application/json' \
  -d '{
    "resourceMetrics": [{
      "resource": {
        "attributes": [{
          "key": "service.name",
          "value": { "stringValue": "my-metric-service" }
        }]
      },
      "scopeMetrics": [{
        "metrics": [{
          "name": "sample_metric",
          "description": "A sample gauge metric",
          "unit": "1",
          "gauge": {
            "dataPoints": [{
              "attributes": [],
              "startTimeUnixNano": 1645639822000000000,
              "timeUnixNano": 1645639823000000000,
              "asDouble": 42.0
            }]
          }
        }]
      }]
    }]
  }'

  curl -X POST http://localhost:55680/v1/logs \
  -H 'Content-Type: application/json' \
  -d '{
    "resourceLogs": [{
      "resource": {
        "attributes": [{
          "key": "service.name",
          "value": { "stringValue": "my-log-service" }
        }]
      },
      "scopeLogs": [{
        "logRecords": [{
          "timeUnixNano": 1645639822000000000,
          "severityText": "INFO",
          "body": {
            "stringValue": "This is a sample log message"
          },
          "attributes": [{
            "key": "log.type",
            "value": { "stringValue": "application" }
          }]
        }]
      }]
    }]
  }'
```