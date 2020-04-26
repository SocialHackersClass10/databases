const mysql = require('mysql');

//connection details
const connection = mysql.createConnection({
    host:'localhost',
    user:'hyfuser',
    password: 'hyfpassword',
    database: 'new_world'
});

//connects mysql server
connection.connect(err => {
    if (err) throw err;
    console.log("\nConnected!");
})

//1-the names of countries with population greater than 8 million
connection.query('SELECT Name FROM country WHERE Population > 8000000', (err,rows) => {
    if (err) throw err;

    console.log('\nData received from DB: the names of countries with population greater than 8 million');
    rows.forEach((row) => {
        console.log(row.Name);
    })
    //console.log(rows);
})

//2-the names of countries that have “land” in their names
connection.query("SELECT Name FROM country WHERE Name LIKE '%land%'", (err,rows) => {
    if (err) throw err;
    console.log('\nData received from DB: the names of countries that have “land” in their names')
    rows.forEach((row) => {
        console.log(row.Name);
    })
})

//3-the names of the cities with population in between 500,000 and 1 million
connection.query("SELECT Name FROM city WHERE Population BETWEEN 500000 AND 1000000", (err, rows) => {
    if(err) throw err;
    console.log('\nData received from DB: the names of the cities with population in between 500,000 and 1 million');

    rows.forEach((row) => {
        console.log(row.Name);
    })
})

//4-the name of all the countries on the continent ‘Europe’
connection.query("SELECT Name FROM country WHERE Continent = 'Europe'", (err,rows) => {
    if (err) throw err;
    console.log('\nData received from DB: the name of all the countries on the continent Europe');

    rows.forEach((row) => {
        console.log(row.Name);
    })
})

//5-list all the countries in the descending order of their surface areas
connection.query('SELECT Name, SurfaceArea FROM country ORDER BY SurfaceArea DESC', (err,rows) => {
    if(err) throw err;
    console.log('\nData received from DB: list all the countries in the descending order of their surface areas')

    rows.forEach((row) => {
        console.log(`The population of ${row.Name} is ${row.SurfaceArea}`)
    } )

})

//6-the names of all the cities in the Netherlands
connection.query("SELECT Name FROM city WHERE CountryCode = 'NLD'", (err,rows) => {
    if(err) throw err;
    console.log('\nData received from DB: the names of all the cities in the Netherlands');

    rows.forEach((row) => {
        console.log(row.Name)
    } )
})

//7-the population of Rotterdam
connection.query("SELECT Population FROM city WHERE Name = 'Rotterdam'", (err,rows) => {
    if (err) throw err;
    console.log('\nData received from DB: the population of Rotterdam');

    rows.forEach(row => {
        console.log(`The population of Rotterdam is ${row.Population}`)
    })
} )

//8-the top 10 countries by Surface Area
connection.query("SELECT Name, SurfaceArea FROM country ORDER BY SurfaceArea DESC LIMIT 10", (err,rows) => {
    if (err) throw err;
    console.log('\nData received from DB: the top 10 countries by Surface Area');

    rows.forEach(row => {
        console.log(`${row.Name} : ${row.SurfaceArea}`);
    })
})

//9-the top 10 most populated cities
connection.query("SELECT Name, Population FROM city ORDER BY Population DESC LIMIT 10", (err,rows)=>{
    if(err) throw err;
    console.log('\nData received from DB: the top 10 most populated cities')

    rows.forEach(row => {
        console.log(`${row.Name} : ${row.Population}`);
    })
})

//10-the population number of the world
connection.query("SELECT SUM(Population) WorldPopulation FROM country", (err,rows) => {
    if(err) throw err;
    console.log('\nData received from DB: the population number of the world');

    rows.forEach(row => {
        console.log(`The population of the world is ${row.WorldPopulation}`);
    })
})

connection.end();