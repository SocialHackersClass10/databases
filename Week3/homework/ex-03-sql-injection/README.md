
# Exercise 3 : SQL injection

You are given the below function which returns the population of a specific country or city.

```js
    function getPopulation(cityOrCountry, name, cb) {
      // assuming that connection to the database is established and stored as conn
      conn.query(
        `SELECT Population FROM ${cityOrCountry} WHERE Name = ${name}`,
        function(err, result) {
          if (err) cb(err);
          if (result.length == 0) cb(new Error("Not found"));
          cb(null, result[0].name);
        }
      );
    }
```



## 1. Give an example of a value that can be passed as `name` that would take advantage of SQL-injection (for example, to insert new fake data in the database)


### Answer:

This function´s SQL statement is prone to injection due to direct parsing of the 2 parameter values provided by an external source.

Following is an example evocation that would yield destructive results ( unexpected by the function´s developer ).

```js
    getPopulation('country','Samoa; update city set population=0',(err,res)=>{ ...
```

The above, when evoked, will select the country Samoa, then run another query that updates all cities with zero population.

It is worth noting that multiple SQL statement execution is by default NOT enabled by the mysql node module, and in such a case this exploit attempt would raise an exception instead of executing the second statement. Nevertheless, it may have been enabled in this particular instance, the function doesn´t control it, and if enabled, the execution will result in the above mentioned consequences.



## 2. Rewrite the function so that it is no longer vulnerable to SQL injection


### Answer:


#### Assumption

It is impossible to simultaneously safeguard against SQL injection risks while keeping the SQL statement intact.


#### Proof of concept:

The following part of the query

```js
        `SELECT Population FROM ${cityOrCountry}`
```

is a security risk that cannot be corrected just by escaping the the inserted value.
Any un-escaped value passed, will always contain an injection risk. However when the value provided for the table name is escaped, then the resulting SQL statement looks like:

```js
        SELECT Population FROM 'country'
```

which, when run, raises an exception. SQL doesn´t like the table name enclosed in quotes.


#### Conclusion

Since escaping the passed value for the table name breaks the select statement, it is imperative to circumvent insertion of table name into the SQL script. Following is an example of a function both fortified against SQL Injection risks while still retaining its table name `selection` option

```js
    function getPopulation(cityOrCountry, name, cb) {
        //
        //  assuming that connection to the database
        //      is established and stored as conn
        //
        //  validate the table name parameter,
        //      accepted values are "country" and "city"
        //      any other value -> report invalid argument
        //
        const paramTableName = String(cityOrCountry).trim().toLowerCase();
        if ( (paramTableName !== 'country') && (paramTableName !== 'city') ) {
            cb(new Error(`Invalid argument for table name: ${cityOrCountry}`));
            return false;
        };
        conn.query(`SELECT Population FROM ${paramTableName
                            } WHERE Name = ${conn.escape(name)}` ,
            function(err, result) {
                if (err) cb(err);
                if (result.length == 0) cb(new Error("Not found"));

                cb(null, result[0].Name);       //  instead of original: .name);
            }
        );
    }
```

