import * as sql from '../src';

const procResults = {
  columns: expect.any(Object),
  rows: [
    [{ ID: 6, PartyAnimalName: 'Diogenes' }],
  ],
  rowsAffected: 0,
};

let connection;

describe('execute (stored procedures) tests using stream interface', () => {
  beforeEach(() => {
    connection = new sql.ConnectionPoolParty({
      dsn: {
        user: 'sa',
        password: 'PoolPartyyy9000',
        server: 'localhost',
        database: 'PoolParty',
        stream: true,
      },
      retries: 1,
      reconnects: 1,
    });
  });
  afterEach(() => {
    connection.close();
  });
  it('emits expected results with explicit warmup', (done) => {
    let attempt = 0;
    let results;
    let errors;
    const setResults = (attemptNumber) => {
      attempt = attemptNumber;
      errors = [];
      results = { rows: [] };
    };
    connection.warmup()
      .then(() => {
        expect(connection.pools[0].connection.connected).toEqual(true);
        const request = connection.request();
        request.input('ID', sql.Int, 6);
        request.execute('GetPartyAnimalByID');
        request.on('recordset', (columns, attemptNumber) => {
          if (attemptNumber > attempt) {
            setResults(attemptNumber);
          }
          results.columns = columns;
        });
        request.on('row', (row, attemptNumber) => {
          if (attemptNumber > attempt) {
            setResults(attemptNumber);
          }
          results.rows.push(row);
        });
        request.on('error', (err, attemptNumber) => {
          if (attemptNumber > attempt) {
            setResults(attemptNumber);
          }
          errors.push(err);
        });
        request.on('done', (rowsAffected, attemptNumber) => {
          results.rowsAffected = rowsAffected;
          expect(attemptNumber).toBe(1);
          expect(errors.length).toBe(0);
          // stringifying because of this issue
          // https://github.com/jasmine/jasmine/issues/786
          expect(JSON.stringify(results)).toEqual(JSON.stringify(procResults));
          done();
        });
      });
  });
  it('emits expected results with implicit warmup', (done) => {
    let attempt = 0;
    let results;
    let errors;
    const setResults = (attemptNumber) => {
      attempt = attemptNumber;
      errors = [];
      results = { rows: [] };
    };
    expect(connection.pools.length).toEqual(0);
    const request = connection.request();
    request.input('ID', sql.Int, 6);
    request.execute('GetPartyAnimalByID');
    request.on('recordset', (columns, attemptNumber) => {
      if (attemptNumber > attempt) {
        setResults(attemptNumber);
      }
      results.columns = columns;
    });
    request.on('row', (row, attemptNumber) => {
      if (attemptNumber > attempt) {
        setResults(attemptNumber);
      }
      results.rows.push(row);
    });
    request.on('error', (err, attemptNumber) => {
      if (attemptNumber > attempt) {
        setResults(attemptNumber);
      }
      errors.push(err);
    });
    request.on('done', (rowsAffected, attemptNumber) => {
      results.rowsAffected = rowsAffected;
      expect(attemptNumber).toBe(1);
      expect(errors.length).toBe(0);
      expect(JSON.stringify(results)).toEqual(JSON.stringify(procResults));
      done();
    });
  });
  it('emits expected results after a reconnect', (done) => {
    let attempt = 0;
    let results;
    let errors;
    const setResults = (attemptNumber) => {
      attempt = attemptNumber;
      errors = [];
      results = { rows: [] };
    };
    connection.warmup()
      .then(() => {
        expect(connection.pools[0].connection.connected).toEqual(true);
        // manually closing a connection to simulate failure
        return connection.pools[0].connection.close();
      })
      .then(() => {
        // verify connection has been manually closed
        expect(connection.pools[0].connection.connected).toEqual(false);
        const request = connection.request();
        request.input('ID', sql.Int, 6);
        request.execute('GetPartyAnimalByID');
        request.on('recordset', (columns, attemptNumber) => {
          if (attemptNumber > attempt) {
            setResults(attemptNumber);
          }
          results.columns = columns;
        });
        request.on('row', (row, attemptNumber) => {
          if (attemptNumber > attempt) {
            setResults(attemptNumber);
          }
          results.rows.push(row);
        });
        request.on('error', (err, attemptNumber) => {
          if (attemptNumber > attempt) {
            setResults(attemptNumber);
          }
          errors.push(err);
        });
        request.on('done', (rowsAffected, attemptNumber) => {
          results.rowsAffected = rowsAffected;
          expect(attemptNumber).toBe(3);
          expect(errors.length).toBe(0);
          expect(JSON.stringify(results)).toEqual(JSON.stringify(procResults));
          done();
        });
      });
  });
  it('emits with expected error for an unhealthy connection and 0 reconnects', (done) => {
    let attempt = 0;
    let results;
    let errors;
    const setResults = (attemptNumber) => {
      attempt = attemptNumber;
      errors = [];
      results = { rows: [] };
    };
    connection.warmup()
      .then(() => {
        expect(connection.pools[0].connection.connected).toEqual(true);
        // manually closing a connection to simulate failure
        return connection.pools[0].connection.close();
      })
      .then(() => {
        // verify connection has been manually closed
        expect(connection.pools[0].connection.connected).toEqual(false);
        const request = connection.request();
        request.input('ID', sql.Int, 6);
        request.execute('GetPartyAnimalByID');
        request.on('recordset', (columns, attemptNumber) => {
          if (attemptNumber > attempt) {
            setResults(attemptNumber);
          }
          results.columns = columns;
        });
        request.on('row', (row, attemptNumber) => {
          if (attemptNumber > attempt) {
            setResults(attemptNumber);
          }
          results.rows.push(row);
        });
        request.on('error', (err, attemptNumber) => {
          if (attemptNumber > attempt) {
            setResults(attemptNumber);
          }
          errors.push(err);
        });
        request.on('done', (rowsAffected, attemptNumber) => {
          expect(attemptNumber).toBe(2);
          expect(errors.length).toBe(1);
          done();
        });
      });
  });
});
