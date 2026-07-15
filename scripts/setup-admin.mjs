import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

const EMAIL = "jeerasakananta@gmail.com";
const PASSWORD = "admin@123";

async function main() {
  console.log("Creating admin user...");

  const { data: userData, error: createError } = await supabase.auth.admin.createUser({
    email: EMAIL,
    password: PASSWORD,
    email_confirm: true,
  });

  if (createError) {
    if (createError.message.includes("already exists")) {
      console.log("User already exists, fetching ID...");
      const { data: users } = await supabase.auth.admin.listUsers();
      const existing = users?.users?.find((u) => u.email === EMAIL);
      if (existing) {
        console.log("User ID: " + existing.id);
        await insertAdminRow(existing.id);
      }
      return;
    }
    console.error("Create user error:", createError.message);
    process.exit(1);
  }

  console.log("User created: " + userData.user.id);
  await insertAdminRow(userData.user.id);
}

async function insertAdminRow(userId) {
  const { error } = await supabase
    .from("admin_users")
    .upsert({ id: userId, email: EMAIL, role: "admin" }, { onConflict: "id" });

  if (error) {
    console.error("Insert admin_users error:", error.message);
    console.log("Note: Make sure migration 0003_admin_users.sql has been run in Supabase SQL Editor.");
    process.exit(1);
  }

  console.log("Admin row inserted into admin_users table");
  console.log("\nLogin at: http://localhost:3000/admin/login");
  console.log("Email: " + EMAIL);
  console.log("Password: " + PASSWORD);
}

main();
