import axios from "axios";

const url = `${process.env.API_URL}/{{ camelCase name }}s`;

export interface {{ properCase name }} {
  id: number;
}

export async function get{{ properCase name }}s(): Promise<{{ properCase name }}[]> {
  try {
    const resp = await axios.get(url);
    return resp.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
