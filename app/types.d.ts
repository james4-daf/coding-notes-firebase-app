// global.d.ts
export {}; // Ensures this file is treated as a module.

declare global {
    // Example: Adding a custom global interface
    interface notesDataTypes {
        name: string;
        content: string;
        id: number;
    }

    // Example: Adding a global variable type
    const notesDataTypes: notesDataTypes;
}