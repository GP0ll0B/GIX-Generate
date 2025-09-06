# G|I|X Generate - Project Setup and Usage

Follow these steps to get the development environment running.

## 1. Installation

First, install the necessary dependencies using `npm`.

```bash
npm install
```

## 2. Environment Variables

This project requires a Gemini API key to function.

Create a local environment file by copying the example file. This file is ignored by Git, so your secret keys will not be committed.

```bash
cp .env.example .env.local
```

Open the newly created `.env.local` file and add your API key:

```.env.local
# This key is used for authenticating with the Google Gemini API.
API_KEY="YOUR_API_KEY_HERE"
```

## 3. Running the Development Server

Start the Vite development server with the following command:

```bash
npm run dev
```

You will see output in your terminal similar to this:

```bash
VITE v5.3.5  ready in 530 ms

  ➜  Local:   https://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### Local Development with HTTPS

The `dev` script has been updated to run the Vite development server over HTTPS (`--https`). This is **required** for features like Facebook Login to work correctly, as they mandate a secure context.

When you first run `npm run dev` and open the local URL, your browser will show a security warning (e.g., "Your connection is not private"). This is expected because the server is using a self-signed certificate that is not trusted by default.

**To proceed, you must accept the security risk and continue to the site.**
*   In Chrome, this is usually done by clicking "Advanced" and then "Proceed to localhost (unsafe)".
*   Other browsers have similar procedures.

This is a standard part of local web development when using self-signed certificates and is safe to do in this context.

## Accessing the App in a Cloud Environment

💡 **IMPORTANT:** When running in a cloud IDE (like Google Cloud Shell, GitHub Codespaces, or Gitpod), you **must use the URL provided by the environment's port forwarding feature**, not the `localhost` link from the terminal.

*   **Why?** The `localhost` URL only works inside the cloud container. The cloud environment securely exposes this internal server to you through a unique, public URL which is already secure (HTTPS).

*   **How to Access:**
    *   **Google Cloud Shell:** Click the **Web Preview** icon (looks like a square with an arrow) at the top of the shell and select the correct port (5173).
    *   **GitHub Codespaces:** A browser tab should open automatically. If not, go to the **Ports** tab in your VS Code terminal panel, find port 5173, and click the **Open in Browser** icon (a globe).
    *   **Gitpod:** A notification will appear asking if you want to **Open Browser**. Click it.

This public URL is the correct way to view and interact with your running application.