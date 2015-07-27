var Sequelize = require('sequelize');
var MysqlFixtureLoader = function (Garden, config, logger) {

    var wait = Garden.wait;
    var fs = require('fs');
    var dbUri = config.get('fixtures-mysql:uri');
    var sequelize_fixtures = require('sequelize-fixtures');
    //var sequelize = new Sequelize(dbUri);
    var sequelize = new Sequelize(dbUri, {logging: false});
    var paths = config.get('fixtures-mysql:fixtures');
    var modelsPath = config.get('fixtures-mysql:models');
    var models = {};

    function isAbsolute(path) {
        return /^\//.test(path);
    }

    function loadModels() {
        if (!isAbsolute(modelsPath)) {
            modelsPath = config.get('root_dir') + '/' + modelsPath;
        }

        fs.readdirSync(modelsPath).forEach(function (file) {
            var nameParts = file.split("/");
            var name = nameParts[(nameParts.length - 1)].split(".")[0];
            models[name] = sequelize.import(modelsPath + '/' + file);
        });
    }

    function loadPath(path) {

        if (!isAbsolute(path)) {
            path = config.get('root_dir') + '/' + path;
        }

        logger.info('fixtures: ' + path);

        loadModels();

        wait.for(function (callback) {
            sequelize.sync({force: true}).on('success', function() {
                logger.info('Mysql models synchronisation successfully!');
                callback();
            }).on('failure', function(err) {
                console.log(err);
                callback();
            });
        });

        wait.forMethod(sequelize_fixtures, 'loadFile', path + '/*.json', models, {log : function(){}});

        logger.info('success');
    }

    this.load = function () {

        logger.info('Loading fixtures: ' + dbUri);

        if (paths instanceof Object) {
            for (var key in paths) {
                var path = paths[key];
                loadPath(path);
            }
        } else {
            loadPath(paths);
        }
    };

    this.drop = function () {
        logger.info('Dropping fixtures: ' + dbUri);

        loadModels();

        wait.for(function (callback) {
            sequelize.drop({force: true}).on('success', function() {
                callback();
            }).on('failure', function(err) {
                console.log(err);
                callback();
            });
        });

        logger.info('success');
    };

};

module.exports = MysqlFixtureLoader;

module.exports.$inject = ['Garden', 'config', 'Logger'];
module.exports.$tags = ['garden.js', 'fixtures', 'loader'];