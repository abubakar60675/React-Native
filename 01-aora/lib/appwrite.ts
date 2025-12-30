import { Account, Avatars, Client, Databases, ID, Query, Storage, TablesDB } from "react-native-appwrite";

export const client = new Client()
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!)
  .setPlatform(process.env.EXPO_PUBLIC_APPWRITE_PLATFORM!);

export const account = new Account(client);
export const avatars = new Avatars(client);
export const databases = new Databases(client);
const tablesDB = new TablesDB(client);
const storage = new Storage(client);


export const DATABASE_ID = process.env.EXPO_PUBLIC_DB_ID!;

export const USERS_COLLECTION_ID =
  process.env.EXPO_PUBLIC_USERS_COLLECTION_ID!;
export const VIDEOS_COLLECTION_ID =
  process.env.EXPO_PUBLIC_VIDEOS_COLLECTION_ID!;
export const BUCKET_ID = process.env.EXPO_PUBLIC_BUCKET_ID!;



export const signIn = async (email: string, password: string) => {
  try {
    const user = await account.createEmailPasswordSession({
      email,
      password,
    });
    if (!user) throw new Error("User not signed in");
    return user;
  } catch (error) {
    console.log(error);
    throw new Error(error as any);
  }

}

export const createUser = async (email: string, password: string, username: string) => {
  try {
    const newAccount = await account.create({
      userId: ID.unique(),
      email,
      password,
      name: username,
    });
    if (!newAccount) throw new Error("Account not created");
    const avatarUrl = avatars.getInitialsURL(username);
    await signIn(email, password)
    const newUser = await tablesDB.createRow({
      databaseId: DATABASE_ID,
      tableId: USERS_COLLECTION_ID,
      rowId: ID.unique(),
      data: { accountId: newAccount.$id, email, username: username, avatar: avatarUrl }
    });
    return newUser;
  } catch (error) {
    console.log(error);
    throw new Error(error as any);
  }

}


export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) throw new Error("User not signed in");
    const res = await tablesDB.listRows({
      databaseId: DATABASE_ID,
      tableId: USERS_COLLECTION_ID,
      queries: [Query.equal("accountId", currentAccount.$id)]
    })
    const currentUser = res?.rows?.[0] ?? null;

    if (!currentUser) throw new Error("User data not found");
    return currentUser;
  } catch (error) {
    console.log(error);
    throw new Error(error as any);
  }
}

export const getAllPosts = async () => {
  try {
    const res = await tablesDB.listRows({
      databaseId: DATABASE_ID,
      tableId: VIDEOS_COLLECTION_ID,
      queries: [
        Query.orderDesc("$createdAt"),
        Query.select([
          "*",                    // all post fields
          "creator.username",     // related user field
          "creator.avatar",       // related user field
        ]),
      ],


    });
    return res.rows;
  } catch (error) {
    console.log(error);
    throw new Error(error as any);
  }
}


export const getLatestPosts = async () => {
  try {
    const res = await tablesDB.listRows({
      databaseId: DATABASE_ID,
      tableId: VIDEOS_COLLECTION_ID,
      queries: [
        Query.orderDesc("$createdAt"),
        Query.limit(7),
        Query.select([
          "*",                    // all post fields
          "creator.username",     // related user field
          "creator.avatar",       // related user field
        ]),
      ],


    });
    return res.rows;
  } catch (error) {
    console.log(error);
    throw new Error(error as any);
  }
}

export const searchPosts = async (query: any) => {
  try {
    if (!query || query.trim() === "") {
      return [];
    }
    const res = await tablesDB.listRows({
      databaseId: DATABASE_ID,
      tableId: VIDEOS_COLLECTION_ID,
      queries: [
        Query.search("title", query),
        Query.select([
          "*",                    // all post fields
          "creator.username",     // related user field
          "creator.avatar",       // related user field
        ]),
      ],
    }
    );
    return res.rows;
  } catch (error) {
    console.log(error);
    throw new Error(error as any);
  }
}

export const getUserPosts = async (userId: any) => {

  try {
    if (!userId) {
      return [];
    }
    const res = await tablesDB.listRows({
      databaseId: DATABASE_ID,
      tableId: VIDEOS_COLLECTION_ID,
      queries: [
        Query.equal("creator", userId),
        Query.select([
          "*",                    // all post fields
          "creator.username",     // related user field
          "creator.avatar",       // related user field
        ]),
      ],
    }
    );
    return res.rows;
  } catch (error) {
    console.log(error);
    throw new Error(error as any);
  }
}

export const signout = async () => {
  try {
    const session = await account.deleteSession({
      sessionId: "current",
    });
    return session;
  } catch (error) {
    console.log(error);
    throw new Error(error as any);
  }
}

export const getFilePreview = async (fileId: any, filType: "image" | "video") => {
  let fileUrl: any = "";
  try {
    if (filType === "video") {
      fileUrl = storage.getFilePreview({
        bucketId: BUCKET_ID,
        fileId: fileId,
      });
    }
    else if (filType === "image") {
      // fileUrl = storage.getFilePreviewURL(BUCKET_ID, fileId, 2000, 2000, ImageGravity.Top, 100);
      fileUrl = storage.getFilePreview({
        bucketId: BUCKET_ID,
        fileId: fileId,
      });
    }
    else {
      throw new Error("Invalid file type");
    }
    if (!fileUrl) throw new Error("File not found");
    return fileUrl;
  } catch (error) {
    console.error(
      "Error getting file preview",
      error
    )
    throw new Error(error as any);
  }

}

export const uploadFile = async (file: any, type: "image" | "video") => {

  if (!file) return

  const asset = {
    name: file.fileName ?? new Date().getTime().toString(),
    type: file.mimeType,
    size: file.fileSize,
    uri: file.uri,
  };

  try {
    const uploadedFile = await storage.createFile({
      bucketId: BUCKET_ID,
      fileId: ID.unique(),
      file: asset,
    });

    const fileUrl = await getFilePreview(uploadedFile.$id, type);

    return fileUrl;
  } catch (error) {
    console.log(error);
    throw new Error(error as any);
  }
}

export const createVideo = async (form: any) => {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, "image"),
      uploadFile(form.video, "video"),
    ]);

    const newPost = await tablesDB.createRow({
      databaseId: DATABASE_ID,
      tableId: VIDEOS_COLLECTION_ID,
      rowId: ID.unique(),
      data: {
        title: form.title,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        prompt: form.prompt,
        creator: form.userId,
      }
    })
    return newPost;
  } catch (error) {
    throw new Error(error as any);
  }

}