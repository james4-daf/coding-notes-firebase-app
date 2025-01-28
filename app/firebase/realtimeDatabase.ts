import { getDatabase, ref, set, push, onValue } from "firebase/database";
import { db } from "./firebaseConfig";
import { useAuth } from "../context/authContext";
import {useEffect} from "react";


// Add data to a Realtime Database node
export const addData = async (path, data) => {
    try {
        const newRef = push(ref(db, path));
        await set(newRef, data);
        console.log("Data added at:", newRef.key);
    } catch (error) {
        console.error("Error adding data:", error);
    }
};

// Read data from a Realtime Database node
export const readData = (path, callback) => {
    const dataRef = ref(db, path);
    onValue(dataRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            const formattedData = Object.keys(data).map((key) => ({
                id: key,
                ...data[key],
            }));
            callback(formattedData);
        } else {
            callback([]);
        }
    });
};



export const readUserData = (userId, path, callback) => {
    if (!userId) {
        console.error("User ID is required to read data.");
        callback([]); // Return empty if no user ID is available
        return;
    }

    const userPath = `users/${userId}/${path}`;
    const dataRef = ref(db, userPath);

    onValue(dataRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            // Convert the nested data into an array
            const formattedData = Object.entries(data).map(([key, value]) => ({
                id: key,
                ...value,
            }));
            callback(formattedData);
        } else {
            callback([]); // Return an empty array if no data exists
        }
    });// Return the unsubscribe function to clean up the listener
};