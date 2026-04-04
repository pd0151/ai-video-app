const { data, error } = await supabase
.from("posts")
.insert([
{
image_url: imageUrl,
user_id: null, // 👈 IMPORTANT (fixes RLS issues)
},
]);

if (error) {
console.error(error);
alert(error.message);
}