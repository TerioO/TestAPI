import { faker } from "@faker-js/faker";
import { BASE_URI } from "./lorem";
import { PostInterface } from "../models/Post";
import { UserInterface } from "../models/User";

interface UserWithId extends UserInterface {
    _id: string
}

const createPost = async (user: UserWithId) => {
    try {
        const newPost: PostInterface = {
            userId: user._id,
            title: faker.lorem.words({ min: 3, max: 12 }),
            body: faker.lorem.paragraphs({ min: 2, max: 6 }),
            createdAt: faker.date.between({ from: user.createdAt ?? new Date(), to: new Date()})
        }
        const response = await fetch(`${BASE_URI}/posts`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newPost)
        })
        const json = await response.json();
        if(!response.ok) throw Error(json.message);
        const post = json.post;
        console.log(`Post created: ...${post._id.substring(12, 24)}\t ${post.createdAt}\t ${post.title.substring(0, 10)}...`) 
    }
    catch(error){
        if(error instanceof Error) console.log(`[API - ERROR] - ${error.message}`)
        else console.log(error)
    }
}


/**
 * Fetch all the users and store them in an array and for each create a post.
 * @param SI - The index to start looping (= 0)
 * @param FI - The index to stop looping (= users.length)
 * @param howMany - How many posts to add per user (= 1)
 * @example
 * addPosts() // Adds 1 post for each user
 * addPosts(5, undefined, 2); // For the last 5 users, add 2 posts from each
 * addPosts(0, 1, 10) // Add 10 posts from the first user
 */
export const addPosts = async (
    SI?: number, 
    FI?: number, 
    howMany?: number
) => {
    try {
        // Users fetch:
        const response = await fetch(`${BASE_URI}/users`);
        const json = await response.json();
        if(!response.ok) throw Error(json.message);
        const users: UserWithId[] = json.users;

        // Loop:
        if(!SI) SI = 0;
        if(!FI) FI = users.length;
        if(!howMany) howMany = 1;
        for(let i=SI; i<FI; i++){
            for(let j=0; j<howMany; j++){
                await createPost(users[i]);
            }
        } 
    }
    catch(error){
        if(error instanceof Error) console.log(`[API ERROR] - ${error.message}`)
        else console.log(error)
    }
}