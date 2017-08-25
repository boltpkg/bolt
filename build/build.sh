rm -rf dist
BUILD=legacy babel src -d dist/legacy --ignore "__tests__,__mocks__"
babel src -d dist/modern --ignore "__tests__,__mocks__"
