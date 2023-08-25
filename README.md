### How to run server:

1. Run docker or install if you do not have one
2. Clone the repository
3. Create mongodb container with `make mongodbinit`
4. Run server with `npm start`

### How to test server:

1. Run docker or install if you do not have one
2. Clone the repository
3. Create mongodb container with `make mongodbinit` or if you have done this previously, **you may skip this one**
4. Test with test runner or `npm test`

### Notes:

Stop docker container using `make mongodbstop`
