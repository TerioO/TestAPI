import { faker } from "@faker-js/faker";
import { BASE_URI } from "./lorem";
import { CreateCommentInterface } from "../controllers/commentController";
import { UserInterface } from "../models/User";
import { PostInterface } from "../models/Post";

interface Users extends UserInterface {
    _id: string
}
interface Posts extends PostInterface {
    _id: string
}
const createComment = async (post: Posts, user: Users) => {
    const payload: CreateCommentInterface = {
        postId: post._id,
        userId: user._id,
        body: faker.lorem.words({ min: 3, max: 20 }),
        createdAt: faker.date.between({ from: post.createdAt || new Date(), to: new Date()})
    }
    try { 
        const response = await fetch(`${BASE_URI}/comments`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        })
        const json = await response.json();
        if(!response.ok) throw Error(json.message)
        return response;
    }
    catch(error){
        if(error instanceof Error) console.log(`[API ERROR] - ${error.message}`);
        else console.log(error)
    }
}

/**
 * This function first fetches all users & posts and stores them in an array. With indexes controll
 * how comments are added to the collection.
 * @param {number | undefined} PSI - The posts index to start looping (= 0)
 * @param {number | undefined} PFI - The posts index to stop looping (= posts.length)
 * @param {number | undefined} USI - The users index to start looping (= 0)
 * @param {number | undefined} UFI - The users index to stop looping (= users.length)
 * @param {number | undefined} howMany - How many comments to add per user (= 1)
 * @example
 * addComments() // Adds 1 comment from each user to all the posts
 * addComments(0, 1, 0, undefined, 1) // Adds 1 comment from each user to the first post 
 * addComments(5, undefined, 8, undefined, 5); // For the last 2 users add 5 comments from each to the last 5 posts
 */
export const addComments = async (
    PSI?: number, 
    PFI?: number, 
    USI?: number, 
    UFI?: number,
    howMany?: number
) => {
    let response;
    let json;
    let users: Users[];
    let posts: Posts[];
    try {
        // Fetch users & posts
        response = await fetch(`${BASE_URI}/users`);
        json = await response.json();
        if(!response.ok) throw Error(json.message);
        users = json.users;
        response = await fetch(`${BASE_URI}/posts`);
        json = await response.json();
        if(!response.ok) throw Error(json.message);
        posts = json.posts;

        // Loop:
        if(!PSI) PSI = 0;
        if(!USI) USI = 0;
        if(!PFI) PFI = posts.length;
        if(!UFI) UFI = users.length;
        if(!howMany) howMany = 1;
        for(let i=PSI; i<PFI; i++){
            let count = 0;
            for(let j=USI; j<UFI; j++){
                for(let k=0; k<howMany; k++){
                    const res = await createComment(posts[i], users[j]);
                    if(res && res.ok) count += 1;
                }
            }
            console.log(`Added ${count} comment(s) to post: ...${posts[i]._id.substring(12, 24)}\t`)
        }
    }
    catch(error){
        if(error instanceof Error) console.log(`[API ERROR] - ${error.message}`)
    }
}