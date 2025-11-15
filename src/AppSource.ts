import { DataSource } from "typeorm"
import { Posts } from "./entity/posts.entity"
import { User } from "./entity/User.entity"

const AppDataSource = new DataSource({
    type: "postgres",
    url: "postgres://ravikumarr@localhost:5432/posts",
    // port: 5432,
    // username: "ravikumarr",
    // password: "",
    // database: "posts",
    synchronize: true,
    // logging: true,
    entities: [Posts, User]
})


export default AppDataSource