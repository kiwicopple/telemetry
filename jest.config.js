module.exports = {
  preset: 'ts-jest', // Use ts-jest for TypeScript
  transform: {
    '^.+\\.tsx?$': 'ts-jest', // Handle TypeScript files
    '^.+\\.jsx?$': 'babel-jest', // Handle JavaScript/ES Module files with Babel
  },
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
}
