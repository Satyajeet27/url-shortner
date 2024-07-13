
import supabase from "./supabase"
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
export async function getUrls(user_id) {
    // console.log(user_id)
    const { data, error } = await supabase.from("urls").select("*").eq("user_id", user_id);
    // console.log(data && data)
    if (error) {
        console.error(error)
        throw new Error("Unable to load URLs")
    }
    // console.log(data)
    return data
}
export async function deleteUrl(id) {
    const { data, error } = await supabase.from("urls").delete("*").eq("id", id);
    // console.log(data && data)
    if (error) {
        console.error(error)
        throw new Error("Unable to load URLs")
    }
    // console.log(data)
    return data
}
export async function createUrl({ title, longUrl, customUrl, user_id }, qrcode) {
    const short_url = Math.random().toString(36).substring(2, 8)
    const fileName = `qr-${short_url}`
    const { error: storageError } = await supabase.storage.from("qrs").upload(fileName, qrcode)
    if (storageError) throw new Error(storageError.message)

    const qr = `${supabaseUrl}/storage/v1/object/public/qrs/${fileName}`
    const { data, error } = await supabase.from("urls").insert([
        {
            title, original_url: longUrl, custom_url: customUrl || null, user_id,
            short_url, qr
        }
    ]).select()
    // console.log(data && data)
    if (error) {
        console.error(error)
        throw new Error("Error creating short url")
    }
    // console.log(data)
    return data
}

export async function getLongUrl(id) {
    const { data, error } = await supabase.from("urls").select("id, original_url").or(`short_url.eq.${id},custom_url.eq.${id}`).single();
    // console.log(data && data)
    if (error) {
        console.error(error.message)
        throw new Error("Error fetching short link")
    }
    // console.log(data)
    return data
}

export async function getUrl({ id, user_id }) {
    const { data, error } = await supabase
        .from("urls")
        .select("*")
        .eq("id", id)
        .eq("user_id", user_id)
        .single();

    if (error) {
        console.error(error.message);
        throw new Error("Short Url not found");
    }

    return data;
}
