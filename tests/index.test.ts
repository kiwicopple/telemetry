// Import the necessary modules
import { createClient } from '../src/index'
import TelemetryClient from '../src/TelemetryClient'

describe('createClient', () => {
  // Test for the existence of the createClient function
  test('createClient function exists', () => {
    expect(typeof createClient).toBe('function')
  })

  // Test for createClient returning a TelemetryClient instance
  test('createClient function returns a TelemetryClient instance', () => {
    const client = createClient({
      logs: { level: 'info' },
      metrics: {},
      traces: {},
      collectors: [],
    })
    expect(client).toBeInstanceOf(TelemetryClient)
  })
})

describe('TelemetryClient', () => {
  // Test if TelemetryClient logs messages correctly
  test('TelemetryClient logs messages correctly', () => {
    const client = new TelemetryClient({
      logs: { level: 'info' },
      metrics: {},
      traces: {},
      collectors: [],
    })

    // Spy on console methods
    const consoleLogSpy = jest
      .spyOn(console, 'log')
      .mockImplementation(() => {})
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {})
    const consoleWarnSpy = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => {})

    // Test log methods
    client.log('Info message')
    client.error('IGNORE (part of the test)')
    client.warn('Warning message')

    // Assertions
    expect(consoleLogSpy).toHaveBeenCalledWith('Info message')
    expect(consoleErrorSpy).toHaveBeenCalledWith('IGNORE (part of the test)')
    expect(consoleWarnSpy).toHaveBeenCalledWith('Warning message')

    // Restore console methods
    consoleLogSpy.mockRestore()
    consoleErrorSpy.mockRestore()
    consoleWarnSpy.mockRestore()
  })

  // Test for correct constructor options in TelemetryClient
  test('TelemetryClient constructor sets options', () => {
    const client = new TelemetryClient({
      logs: { level: 'debug' },
      metrics: {},
      traces: {},
      collectors: [],
    })
    expect(client['options'].logs.level).toBe('debug')
  })
})
