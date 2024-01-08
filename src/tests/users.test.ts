import request from "supertest";
import { testSetup } from "./testSetup";
import env from "../config/validateEnv";

beforeAll(() => {
    return testSetup.init(3600);
})
 
describe("Pagination - Tested on users collection", () => {
    it(`1. /users?page=-10 - Should return ${env.GET_LIMIT} users`, async () => {
        const response = await request(testSetup.app)
            .get("/users?page=-10")
            .expect(200)
        expect(response.body.users).toHaveLength(env.GET_LIMIT)
    })

    it(`2. /users?page=0 - Should return ${env.GET_LIMIT} users`, async () => {
        const response = await request(testSetup.app)
            .get("/users?page=0")
            .expect(200)
        expect(response.body.users.length > env.GET_LIMIT)
    })

    it(`3. /users?page=2&limit=-20 - Should return ${env.GET_LIMIT} users`, async () => {
        const response = await request(testSetup.app)
            .get("/users?page=2&limit=-20 ")
            .expect(200)
        expect(response.body.users.length == env.GET_LIMIT)
    })

    it(`4. /users?page=2&limit=3 - Should return 3 users`, async () => {
        const response = await request(testSetup.app)
            .get("/users?page=2&limit=3 ")
            .expect(200)
        expect(response.body.users.length == 3)
    })

    it(`5. /users?limit=3 - Should return all users`, async () => {
        const response = await request(testSetup.app)
            .get("/users?limit=3 ")
            .expect(200)
        expect(response.body.users.length > env.GET_LIMIT)
    })

    it(`6. /users?page=5&limit=20 - Should not return any users`, async () => {
        const response = await request(testSetup.app)
            .get("/users?page=5&limit=20 ")
            .expect(404)
        expect(response.body.isError)
    })

    it(`7. /users?page=1&select=_id - Should return objects with 1 property: _id`, async () => {
        const response = await request(testSetup.app)
            .get("/users?page=1&select=_id")
            .expect(200)
        expect(Object.keys(response.body.users[0]).length).toBe(1);
        expect(response.body.users[0]).toHaveProperty("_id")
    })

    it(`8. /users?page=1&select=-_id - Should return objects without property: _id`, async () => {
        const response = await request(testSetup.app)
            .get("/users?page=1&select=-_id")
            .expect(200)
        expect(Object.keys(response.body.users[0])).not.toHaveProperty("_id");
    })

    it(`9. /users?page=1&sort=username - Should return objects sorted ascending by property: username`, async () => {
        const response = await request(testSetup.app)
            .get("/users?page=1&sort=username")
            .expect(200)
        const sortedArray = [...response.body.users].sort();
        expect(response.body.users).toEqual(sortedArray);
    })

    it(`10. /users?page=1&sort=-username - Should return objects sorted descending by property: username`, async () => {
        const response = await request(testSetup.app)
            .get("/users?page=1&sort=-username")
            .expect(200)
        const sortedArray = [...response.body.users].sort((a, b) => {
            if(b > a) return 1;
            else if (b < a) return -1;
            else return 0;
        });
        expect(response.body.users).toEqual(sortedArray);
    })
})

describe("users collection", () => {
    it("1. Should create a new user", async () => {
        request(testSetup.app)
            .post("/users")
            .send({
                username: "Mike1",
                birthday: "01-01-2010",
                createdAt: "01-01-2022",
                updatedAt: "01-01-2023"
            })
            .expect(201)
    })

    it("2. Should fail to create user - duplicate", async () => {
        request(testSetup.app)
            .post("/users")
            .send({
                username: "Mike1"
            })
            .expect(400)
    })

    it("3. Should fail to create user - missing field username", async () => {
        request(testSetup.app)
            .post("/users")
            .send({
                birthday: "Mike1"
            })
            .expect(400)
    })

    it("3. Should fail to create user - invalid date format", async () => {
        request(testSetup.app)
            .post("/users")
            .send({
                username: "Dave1",
                birthday: "Mike1"
            })
            .expect(400)
    })

    it("4. Should update the username", async () => {
        const response = await request(testSetup.app)
            .patch("/users/65981311bc45312292eb0a7c")
            .send({
                username: "Jayde2"
            })
            .expect(200)
        expect(response.body.user.username).toEqual("Jayde2")
    })

    it("5.1. Should fail to update user - invalid id", async () => {
        await request(testSetup.app)
            .patch("/users/95981311bc45312292eb0a7c")
            .expect(400)
    })

    it("5.2. Should fail to update user - invalid id", async () => {
        await request(testSetup.app)
            .patch("/users/65981311bc")
            .expect(400)
    })

    it("6. Should fail to update user - no req.body sent", async () => {
        await request(testSetup.app)
            .patch("/users/65981311bc45312292eb0a7c")
            .send({})
            .expect(400)
    })

    it("7. Should fail to update user - no req.body sent", async () => {
        await request(testSetup.app)
            .patch("/users/65981311bc45312292eb0a7c")
            .send({})
            .expect(400)
    })
})

afterAll(() => {
    return testSetup.end();
})
