import mongoose from "mongoose";

//conect to database
export const connectDB = async () => {
    
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI,
            {
                useNewUrlParser: true,
            useUnifiedTopology: true,
            }
        );
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        const dbName = mongoose.connection.name;
        console.log(`Connected to database: ${dbName}`);
    } catch (error) {
        console.log(error);
        console.log("Failed to connect to MongoDB");
        process.exit(1);
    }
}