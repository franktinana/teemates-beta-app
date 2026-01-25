const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

exports.handler = async (event) => {
  // CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ message: "Method Not Allowed" })
    };
  }

  try {
    const { name, email, category, message } = JSON.parse(event.body);

    // Validate required fields
    if (!name || !email || !category || !message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: "All fields are required" })
      };
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: "Invalid email address" })
      };
    }

    // Insert into Supabase 'support_requests' table
    const { data, error } = await supabase
      .from("support_requests")
      .insert([{
        name,
        email,
        category,
        message,
        created_at: new Date().toISOString()
      }]);

    if (error) {
      console.error("Supabase Error:", error);
      throw error;
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: "Support request submitted successfully" }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: "Failed to submit request" })
    };
  }
};
