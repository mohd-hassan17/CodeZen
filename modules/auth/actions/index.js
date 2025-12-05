"use server";


import {db} from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

export const onBoardUser = async () => {
    try {
        const user = await currentUser();
        
        if(!user) {
            return {success: false, message: "No user found" };
        };

        const { id, emailAddresses, firstName, lastName, imageUrl } = user;

        const newUser = await db.user.upsert({
            where: { clerkId: id },
            update: {
                email: emailAddresses[0]?.emailAddress || null,
                firstName: firstName || null,
                lastName: lastName || null,
                imageUrl: imageUrl || null,
            },
            create: {
                clerkId: id,
                email: emailAddresses[0]?.emailAddress || null,
                firstName: firstName || null,
                lastName: lastName || null,
                imageUrl: imageUrl || null,
            }
        })
        return { success: true, user: newUser, message: "User onboarded successfully" };
    } catch (error) {
        console.error("Error onboarding user:", error);
        return { success: false, message: "Error onboarding user" };
    }
}

export const currentUserRole = async () => {
    try {
        const user = await currentUser();
        if(!user) {
            return {success: false, message: "No user found" };
        }
        const { id } = user;
        const dbUser = await db.user.findUnique({
            where: { clerkId: id },
            select: { role: true },
        });
        return dbUser?.role || null;
    } catch (error) {
        
    }
}