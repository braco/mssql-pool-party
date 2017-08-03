# 0.1.5 (July 21th, 2017)

## Other

- Improved debug logs
- All debug logs go to stdout
- No changes in production functionality

# 0.1.4 (June 27th, 2017)

## Bug Fixes

- Fixed error when running `connection.request().query('...')` commands that did not return a recordset (e.g. `TRUNCATE TABLE ...`)

## Other

- Added a high-write integration test
- Added unit test
- Added a bit more debug logging

# 0.1.3 (April 5th, 2017)

## Bug Fixes

- Removed pool.dsn.password from PoolError to avoid passwords showing up in error logging

# 0.1.2 (April 3rd, 2017)

## Bug Fixes

- Fixed returnValue not being return when calling execute
- Fixed broken execute callback tests

# 0.1.1 (April 3rd, 2017)

## Features

- Added `connectionPoolConfig` option to the ConnectionPoolParty constructor. This new option lets you set configuration options that will be passed to the mssql ConnectionPool constructor. This provides a way to set things like timeouts without having to create a custom connectionPoolFactory or dsnProvider. _Note: any options set here will override options created by the dsnProvider_

# 0.1.0 (April 3rd, 2017)

First Release!