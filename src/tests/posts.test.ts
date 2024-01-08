import request from "supertest";
import { testSetup } from "./testSetup";

beforeAll(() => {
    testSetup.init(3601);
})

describe("GET/posts", () => {
    it("should return all posts", async () => {
        await request(testSetup.app)
            .get("/posts")
            .expect(200)
    })
})

afterAll(() => {
    testSetup.end();
})

