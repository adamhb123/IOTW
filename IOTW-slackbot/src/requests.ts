// External modules
import path from "path";
import fetch from "cross-fetch";
import FormData from "form-data";
// Local modules
import Config from "./config";

const apiURL = `${!Config.api.host.includes("http") ? "http://" : ""}${
  Config.api.host
}:${Config.api.port}`;

async function checkApiAlive() {
  try {
    await fetch(apiURL);
  } catch {
    console.error("Database api is down! Did you start it?");
    return false;
  }
  return true;
}

export async function get(endpoint: string) {
  if (!(await checkApiAlive())) return;
  const response = await fetch(path.join(apiURL, endpoint));
  return response.json();
}

export async function postFormData(endpoint: string, data = {}) {
  if (!(await checkApiAlive())) return;
  // Construct FormData from given data
  const formData = new FormData();
  for (const [k, v] of Object.entries(data))
    formData.append(k, JSON.stringify(v));

  const response = await fetch(path.join(apiURL, endpoint), {
    method: "POST",
    headers: {
      ...formData.getHeaders(),
    },
    // @ts-expect-error: ts(2322)
    body: formData,
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

export default {
  get: get,
  postFormData: postFormData,
};
