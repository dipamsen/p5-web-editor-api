import axios from "axios";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

/** @type {import("axios").Axios} */
const p5 = axios.create({
  baseURL: "https://editor.p5js.org/",
});

export default class Client {
  constructor() {
    if (process.env.P5_COOKIE) {
      this.cookie = process.env.P5_COOKIE;
    } else {
      this.cookie = "";
    }
    this.config = {};
    this.userInfo = {};
    this.isLoggedIn = false;
  }
  async login({ username, email, password }) {
    this.config.credentials = { email: email || username, password };
    try {
      const res = await p5.post("/editor/login", this.config.credentials);
      this.userInfo = res.data;
      this.cookie = res.headers["set-cookie"][0];
      p5.defaults.headers.Cookie = this.cookie;
      this.isLoggedIn = true;
    } catch (err) {
      console.error(err.response.data.message);
    }
  }
  async getSession() {
    try {
      p5.defaults.headers.Cookie = this.cookie;
      const res = await p5.get("/editor/session");
      this.userInfo = res.data;
      this.isLoggedIn = true;
      return "Successfully logged in as " + res.data.username;
    } catch {
      this.isLoggedIn = false;
      return "Not logged in (invalid session)";
    }
  }
  async getSketch(id) {
    const res = await p5.get(
      `/editor/${this.userInfo.username}/projects/${id}`
    );
    return res.data;
  }
  async updateSketch(sketch, file, content) {
    const currTime = new Date().toISOString();
    try {
      const res = await p5.put(`/editor/projects/${sketch.id}`, {
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
      });
      return "Successfully updated sketch";
    } catch (err) {
      console.error(err.response.data.message);
    }
  }
}
