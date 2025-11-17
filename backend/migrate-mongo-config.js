require("ts-node/register");

module.exports = {
  mongodb: {
    url: "mongodb+srv://victordeemarque7_db_user:FullStack123@fullstack.fqnvon6.mongodb.net/",

    databaseName: "fullstack.fqnvon6.mongodb.net",

    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
     
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
