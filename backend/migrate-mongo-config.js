require("ts-node/register");

module.exports = {
  mongodb: {
    url: "mongodb+srv://victordeemarque7_db_user:FullStack123@fullstack.fqnvon6.mongodb.net/",

    databaseName: "fullstack",

    options: {
      // Opções removidas: useNewUrlParser e useUnifiedTopology não são mais suportadas
      // nas versões mais recentes do MongoDB driver
    }
  },

  migrationsDir: "migrations",

  changelogCollectionName: "changelog",

  lockCollectionName: "changelog_lock",

  lockTtl: 0,
 
  migrationFileExtension: ".ts",

  useFileHash: false,

  moduleSystem: 'commonjs',
};
