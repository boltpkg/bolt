EXIT_STATUS=0
echo "$ flow status"
yarn run flow status || EXIT_STATUS=$?
echo "$ jest --coverage"
yarn run jest -- --coverage || EXIT_STATUS=$?
exit $EXIT_STATUS
