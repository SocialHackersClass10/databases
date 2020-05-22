
# About this app

This is the Implementation of  Databases - week 1 - exercise 2.

All the requirements are implemented through code, with entry point being app.js.

Additionally, for reading convenience, all numbers are formatted with thousands separators, respectfully to the locale.



## Prerequisites: MySQL server connection params definition file

The application requires the connection parameters for MySQL Community Server to be specified in the file:
```
    ./resources/mysql-params.json.
```

Following is an example of this file's content:
```
    {
        "host"      : "<INSERT_YOUR_MYSQL_HOST_ADDRESS_OR_IP_HERE>" ,
        "port"      : <INSERT_YOUR_MYSQL_PORT_NUMBER_HERE> ,
        "user"      : "<INSERT_YOUR_MYSQL_USER_NAME_HERE>" ,
        "password"  : "<INSERT_YOUR_MYSQL_USER_PASSWORD_HERE>"
    }
```

Minimum required definitions are for "user" and "password".

If at run-time any of the minimum requirements, or the file altogther, are missing, the app will log a respective message and terminate.

All other missing MySQL connection parameters will assume default values.



## Output

The application iterates through the exercise requirements in steps as follows:

#### Initialize
*   Connect to MySQL Community Server
*   Activate "world" database


#### 1.  List all countries with population greater than 8 million
*   produces a moderate length list, approximately 90 rows long
*   rows are sorted alphabetically by country name


#### 2.  List all countries having “land” in their name
*   produces a short list, approximately 30 rows long
*   rows are sorted alphabetically by country name


#### 3.  List all cities with population between 500,000 and 1 million
*   produces a very long list, approximately 300 rows
*   rows are sorted alphabetically by city name, then by population descending


#### 4.  List all countries on the continent of ‘Europe’
*   produces a short list, approximately 46 rows long
*   rows are sorted alphabetically by country name


#### 5.  List all countries in descending order of surface area
*   produces a very long list, approximately 240 rows
*   rows are sorted bu Surface Area descending, then alphabetically by country name


#### 6.  List all cities in the Netherlands
*   produces a short list, approximately 30 rows long
*   rows are sorted alphabetically by city name


#### 7.  What is the population of Rotterdam?
*   produces 1 row of data


#### 8.  List the top 10 countries by Surface Area
*   produces exactly 10 rows
*   rows are sorted by Surface Area in descending order

*Note: this is almost identical to request 5. Only difference here is the "top 10" limiting the result.


#### 9.  List the top 10 most populated cities
*   produces exactly 10 rows
*   rows are sorted by population in descending order, then city name

*Note: steps 8 & 9 could have been so much more interesting an exercise, if the requested result was to be sorted by name, i.e. list the top 10 populated cities, but sort them by name alphabetically. In fact, to showcase this, such queries are implemented in bonus step 1 and 2.


#### 10.  What is the total population of the world?
*   produces 1 row of data


#### Bonus 1.  List the Top 20 Populated countries sorted alphabetically by Name
*   produces exactly 20 rows
*   rows are sorted alphabetically by country name by the sql statement, not by operating on the result dataset through code

*Note: this also includes a "Top 10 Spot" column, showcasing the ability to include "ROW ID counters" in the sql statement


#### Bonus 2.  List the Top 50 densely populated countries sorted alphabetically by Name
*   produces exactly 50 rows
*   rows are sorted alphabetically by country name by the sql statement, not by operating on the result dataset through code


#### Finalize
*   Disconnect from MySQL Community Server
*   Terminate application

