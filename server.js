import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from "@apollo/server/standalone"

let users = [
    {id: "1", name: "John Doe", age: 30, isMarried: true},
    {id: "2", name: "Jane Smith", age: 25, isMarried: false}
]

const typeDefs = `
    type Query {
        getUsers: [User]
        getUserById(id: ID!): User
    }

    type Mutation {
        createUser(name: String!, age: Int!, isMarried: Boolean!): [User]
        deleteUserById(id: ID!): [User]
    }

    type User {
        id: ID
        name: String
        age: Int
        isMarried: Boolean
    }
`

const resolvers = {
    Query: {
        getUsers: () => {
            return users
        },
        getUserById: (parent, args) => {
            const id = args.id
            return users.find((user) => user.id === id)
        }
    },
    Mutation: {
        createUser: (parent, args) => {
            const { name, age, isMarried } = args
            const newUser = {
                id: (users.length + 1).toString(),
                name,
                age,
                isMarried
            }
            users.push(newUser)
            return users
        },
        deleteUserById: (parent, args) => {
            const id = args.id
            users = users.filter((user) => user.id !== id)
            return users
        }
    }
}

const server = new ApolloServer({typeDefs, resolvers});

const {url} = await startStandaloneServer(server, {
    listen: {port: 8000}
})

console.log(`Server Running at: ${url}`)