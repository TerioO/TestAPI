import { faker } from "@faker-js/faker";
import { BASE_URI } from "./lorem";
import { TodoInterface } from "../models/Todo";
import { UserInterface } from "../models/User";

interface User extends UserInterface {
    _id: string
}

const createTodo = async (user: User) => {
    const todo: TodoInterface = {
        userId: user._id,
        title: faker.lorem.words({ min: 3, max: 8 }),
        body: faker.lorem.words({ min: 12, max: 70 }),
        completed: (Math.random() * 100) > 50 ? true : false,
        deadline: faker.date.between({ from: user.createdAt || new Date(), to: "2026" })
    }
    const response = await fetch(`${BASE_URI}/todos`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(todo)
    });
    return response;
}

/**
 * Fetch the users and store them in an array, and for each create a todo.
 * @param SI - The index to start looping (= 0)
 * @param FI - The index to stop looping (= users.length)
 * @param howMany - How many todos to add per user (= 1)
 * @example
 * addTodos(undefined, undefined, 10) // Create 10 todos for each user
 * addTodos() // Create 1 todo for each user
 * addTodos(0, 1, 10) // Create 10 todos for the first user
 */
export const addTodos = async (SI?: number, FI?:number, howMany?: number) => {
    try {
        // Users fetch:
        const response = await fetch(`${BASE_URI}/users`);
        const json = await response.json();
        if(!response.ok) throw Error(json.message);
        const users: User[] = json.users;

        // Looping:
        if(!SI) SI = 0;
        if(!FI) FI = users.length;
        if(!howMany) howMany = 1;
        for(let i=SI; i<FI; i++){
            let count = 0;
            for(let j=0; j<howMany; j++){
                const res = await createTodo(users[i]);
                const json = await res.json();
                if(!res.ok) console.log(`[API ERROR] - ${json.message}`)
                else count += 1;
            }
            console.log(`Created ${count} todo(s) for user: ${users[i].username}`)
        }
    }
    catch(error){
        if(error instanceof Error) console.log(`[API ERROR] - ${error.message}`)
        else console.log(error)
    }
}