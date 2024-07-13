import { data } from "autoprefixer";
import supabase from "./supabase";
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL

export async function login({ email, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw new Error(error.message)
    // console.log("loginApi", data)
    return data
}
export async function getCurrentUser() {
    const { data: session, error } = await supabase.auth.getSession()
    if (!data) return null
    if (error) throw new Error(error.message)
    return session.session?.user
}
export async function signup({ name, email, password, profile_pic }) {
    const fileName = `dp-${name.split(" ").join("-")}-${Date.now()}`
    const { error: storageError } = await supabase.storage.from("profile_pic").upload(fileName, profile_pic)
    if (storageError) throw new Error(storageError.message)
    const { data, error } = await supabase.auth.signUp({
        email, password, options: {
            data: {
                name,
                profile_pic: `${supabaseUrl}/storage/v1/object/public/profile_pic/${fileName}`
            }
        }
    })
    // console.log("test", data)
    if (error) throw new Error(error.message)
    return data
}

export async function logout() {
    const { error } = await supabase.auth.signOut()
    if (error) throw new Error(error.message)
}