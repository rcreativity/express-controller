"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const posts_entity_1 = require("./entity/posts.entity");
const User_entity_1 = require("./entity/User.entity");
const AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    url: "postgres://ravikumarr@localhost:5432/posts",
    // port: 5432,
    // username: "ravikumarr",
    // password: "",
    // database: "posts",
    synchronize: true,
    // logging: true,
    entities: [posts_entity_1.Posts, User_entity_1.User]
});
exports.default = AppDataSource;
