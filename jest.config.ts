export default {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'],
    moduleDirectories: ['node_modules', 'src'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '\\.svg$': '<rootDir>/src/tests/__mocks__/svgMock.js',
        '\\.(jpg|jpeg|png|gif|webp|ico)$':
            '<rootDir>/src/tests/mocks/fileMock.js',
        'lottie-react': '<rootDir>/src/tests/mocks/lottieMock.js',
    },
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    testMatch: ['<rootDir>/src/tests/**/*.test.(ts|tsx)'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    preset: 'ts-jest',
    globals: {
        'ts-jest': {
            tsconfig: {
                module: 'esnext',
            },
        },
    },
};
