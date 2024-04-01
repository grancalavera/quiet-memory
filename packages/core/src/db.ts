import { Client } from "pg";

export async function testConnection() {
  const client = new Client();
  await client.connect();
  const result = await client.query("SELECT NOW()");
  console.log(result);
  await client.end();
}
