# p5 Web Editor API

<!-- This README file has been partly generated by GitHub Copilot. -->

This node CLI uses the internal p5.js Web Editor API to log in and edit sketches.

## Usage

1. Install dependencies: `npm install`

2. Run the CLI: `node .`

3. Log in with your p5.js Web Editor credentials and select a sketch to edit.

**Recommended:** _First, create a new sketch in the p5 Web Editor for testing purposes. Then, run the CLI with this sketch._

> (Optional) Create a `.env` file with the following contents to avoid having to enter your username and password every time you run the CLI:
>
> ```env
> P5_USERNAME=your_username
> P5_PASSWORD=your_password
> ```

## Support for Social OAuth Logins

This CLI only supports logging in with p5.js credentials (username and password). If your account is linked to a social login (e.g. Google or GitHub), then follow the steps below:

1. Log in to the p5 Web Editor. Go to this URL: https://editor.p5js.org/editor/session
2. Open the browser's developer tools and in the "Network" tab, click on the "session" request. In the "Request Headers", copy the value of the "Cookie" header.
3. Create a `.env` file with the following contents:
   ```env
   P5_COOKIE="your_cookie_value"
   ```
   (Make sure to include the quotes!)
4. Run the CLI.

## License

MIT
