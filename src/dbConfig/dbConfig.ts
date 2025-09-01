import mongoose from 'mongoose';
// import dotenv from 'dotenv';


export  async function connect () {
    try{
        mongoose.connect(process.env.MONGODB_URI!);
        const connection = mongoose.connection;

        if(mongoose.connection.readyState === 0){
            await mongoose.connect(process.env.MONGODB_URI || "", {
                bufferCommands:false,
            });
        }

        connection.on('connected', () => {
            console.log('MongoDB connected succesfully');
        })

       connection.on('error', (err) => {
        console.log('MongoDB connection error.Please make sure MonngoDB is running.' + err);
        process.exit();
       }) 
    }catch (error) {
        console.log('Something went wrong!');
        console.log(error);
    }
}

// import mongoose from 'mongoose';

// export async function connect() {
//     try {
//         mongoose.connect(process.env.MONGO_URI!);
//         const connection = mongoose.connection;

//         connection.on('connected', () => {
//             console.log('MongoDB connected successfully');
//         })

//         connection.on('error', (err) => {
//             console.log('MongoDB connection error. Please make sure MongoDB is running. ' + err);
//             process.exit();
//         })

//     } catch (error) {
//         console.log('Something goes wrong!');
//         console.log(error);
        
//     }


// }