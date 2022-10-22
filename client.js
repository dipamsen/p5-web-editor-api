import axios from "axios";
import fs from "fs";

/** @type {import("axios").Axios} */
const p5 = axios.create({
  baseURL: "https://editor.p5js.org/",
});

export default class Client {
  constructor() {
    this.cookie = "";
    this.config = {};
    this.userInfo = {};
  }
  async login({ username, email, password }) {
    this.config.credentials = { email: email || username, password };
    try {
      const res = await p5.post("/editor/login", {
        email: email || username,
        password,
      });
      this.userInfo = res.data;
      this.cookie = res.headers["set-cookie"][0];
    } catch (err) {
      console.error(err.response.data.message);
    }
  }
  async getSketch(id) {
    const res = await p5.get(
      `/editor/${this.userInfo.username}/projects/${id}`,
      {
        headers: { Cookie: this.cookie },
      }
    );
    return res.data;
  }
  async updateSketch(sketch, file, content) {
    const currTime = new Date().toISOString();
    const res = await p5.put(
      `/editor/projects/${sketch.id}`,
      {
        files: sketch.files.map((f) => {
          if (f.name === file) {
            f.content = content;
            f.updatedAt = currTime;
          }
          return f;
        }),
        id: sketch.id,
        isSaving: false,
        owner: sketch.user,
        updatedAt: currTime,
      },
      {
        headers: { Cookie: this.cookie },
      }
    );
    if (res.data.error) {
      console.error(res.data.error);
    } else {
      return "Successfully updated sketch";
    }
  }
}
