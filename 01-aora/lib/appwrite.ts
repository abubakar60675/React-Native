import { Account, Avatars, Client, Databases, ID, Query, TablesDB } from "react-native-appwrite";

export const client = new Client()
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!)
  .setPlatform(process.env.EXPO_PUBLIC_APPWRITE_PLATFORM!);

export const account = new Account(client);
export const avatars = new Avatars(client);
export const databases = new Databases(client);
const tablesDB = new TablesDB(client);


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
    throw new Error(error as string);
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
    throw new Error(error as string);
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
    throw new Error(error as string);
  }
}