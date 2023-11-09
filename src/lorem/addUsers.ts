import { faker } from "@faker-js/faker";
import { BASE_URI } from "./lorem";
import { UserInterface } from "../models/User";
import dayjs from "dayjs";

const createUser = async (username: string = "") => {
    const newUser: UserInterface = {
        username: !username ? faker.person.firstName() : username,    // For testing
        birthday: faker.date.birthdate({ min: 1970, max: 2002, mode: "year" }),
        createdAt: faker.date.birthdate({ min: 2010, max: 2021, mode: "year" })
    }
    try {
        const response = await fetch(`${BASE_URI}/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newUser)
        })
        const json = await response.json();
        if(!response.ok) throw Error(json.message);
        const user: UserInterface = json.user; 
        console.log(`User created: ${user.username}\t ${dayjs(user.birthday).format("DD-MM-YYYY HH:mm")}`)
    }
    catch(error){
        if(error instanceof Error) console.log(`[API ERROR] - ${error.message}`);
        else console.log(error);
    }
}

export const addUsers = async (howMany: number) => {
    for(let i=0; i<howMany; i++){
        await createUser();
    }
}