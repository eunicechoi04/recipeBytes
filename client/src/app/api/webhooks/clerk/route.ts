import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import axios from "axios";

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    console.log(process.env);
    throw new Error(
      "Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET);

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing Svix headers", {
      status: 400,
    });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error: Could not verify webhook:", err);
    return new Response("Error: Verification error", {
      status: 400,
    });
  }

  // Do something with payload
  // For this guide, log payload to console
  const { id } = evt.data;
  const eventType = evt.type;
  //   console.log(`Received webhook with ID ${id} and event type of ${eventType}`);
  //   console.log("Webhook payload:", body);

  if (eventType === "user.created") {
    try {
      let username = evt.data.username;
      if (username === null) {
        const email = evt.data.email_addresses[0].email_address;
        username = email.substring(0, email.indexOf("@"));
      }
      const user = {
        id: evt.data.id,
        email: evt.data.email_addresses[0].email_address,
        username: username,
        first_name: evt.data.first_name,
        last_name: evt.data.last_name,
      };
      const res = await axios.post("http://localhost:8080/api/createUser", {
        user,
      });
    } catch (err) {
      console.error("Error: Could not create user:", err);
      return new Response("Error: Could not create user", {
        status: 400,
      });
    }
  }

  if (eventType === "user.updated") {
    try {
      let username = evt.data.username;
      if (username === null) {
        const email = evt.data.email_addresses[0].email_address;
        username = email.substring(0, email.indexOf("@"));
      }
      const user = {
        id: evt.data.id,
        email: evt.data.email_addresses[0].email_address,
        username: username,
        first_name: evt.data.first_name,
        last_name: evt.data.last_name,
      };
      const res = await axios.post("http://localhost:8080/api/updateUser", {
        user,
      });
    } catch (err) {
      console.error("Error: Could not update user:", err);
      return new Response("Error: Could not update user", {
        status: 400,
      });
    }
  }

  return new Response("Webhook received", { status: 200 });
}
