plus.garden.fixtures-mysql
=======================

mysql fixtures loader for plus.garden

this module uses https://github.com/domasx2/sequelize-fixtures


Install
===========================

Install npm package
```
npm i plus.garden.fixtures-mysql --save
```

Add service to garden container
```
container.register('MysqlFixtureLoaderModule', require('plus.garden.fixtures-mysql'));
```

Add config section to garden config

```javascript
"fixtures-mysql": {

    "uri": "mysql://user@localhost:3306/dbname",

    "models": "fixtures/mysql/models", //models folder

    "fixtures": "fixtures/mysql"  // fixtures folder

}
```

Usage
=========================================

For creating models and fixtures files please use [File formats](https://github.com/domasx2/sequelize-fixtures#file-formats)
and [Associations](https://github.com/domasx2/sequelize-fixtures#associations) from [sequelize-fixtures docs](https://github.com/domasx2/sequelize-fixtures)


commands:
```
./garden.js fixtures.load
./garden.js fixtures.drop
```

`fixture.load` runs `fixtures.drop` automatically