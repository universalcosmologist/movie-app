import {Client,Databases,ID,Query} from 'appwrite'

const DB_ID=import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COL_ID=import.meta.env.VITE_APPWRITE_COLLECTION_ID
const ENDPOINT=import.meta.env.VITE_APPWRITE_ENDPOINT;
const PROJECT_ID=import.meta.env.VITE_APPWRITE_PROJECT_ID;

const client = new Client();
client
  .setEndpoint(`${ENDPOINT}`)
  .setProject(`${PROJECT_ID}`);

const databases = new Databases(client);

export const updateCount=async(movie)=>{
   try {
    const result=await databases.listDocuments(DB_ID,COL_ID,[
        Query.equal("movie_id",movie.id)
    ]);

    if(result.documents.length>0){
        //present in the db already increase the count
        const doc=result.documents[0];
        await databases.updateDocument(DB_ID,COL_ID,doc.$id,{
            count:doc.count+1,
        });
    }else{
        await databases.createDocument(DB_ID,COL_ID,ID.unique(),{
            count: 1,
            movie_id: movie.id,
            poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        })
    }
   } catch (error) {
     console.log("error occured in updateCount function",error);
   }
}

export const getTrendingMovies=async()=>{
    try {
        const result=await databases.listDocuments(DB_ID,COL_ID,[
           Query.limit(5),
           Query.orderDesc("count"),
        ]);
        if(result.documents.length>0) return result.documents;

    } catch (error) {
        console.log("error occured in getTrendingMovies function",error);
    }
}