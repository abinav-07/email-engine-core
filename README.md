<!-- Use cmd+shift+v in macOS or ctrl+alt+v on windows to open as a preview -->
# Email Engine Core
Email Engine Core using Node/Express.js, Elastic Search, Kibana, React.js, Jwts, socket.io, CRON jobs and Outlook Email Service. 
`Works Better in Mac, not tested in Windows`

### Notes:
1. Used cron job and socket.io along with delta links of outlook email service for continuous sync of emails on Frontend and backend. Alternate method would be using ngrok and webhooks in outlook for mail changes, but the setup is not done in that way.

### CONFIGURATION

`NOTE: Initial Seeder is run along with initial indices creation giving below admin access on /admin/login page`
#### Admin Cred: admin@gmail.com admin

This section covers the process for configuring and installing the application packages.


1. Install `docker` in your system.
2. Add `.env` to your `root` directory, It has exampleenv file, you can copy same values to .env and we will make required changes in this file as we read the documentation below (use the ports specified in the file, further configs not done yet).
3. First, we need to setup an application in outlook. 
    - Go to https://entra.microsoft.com/ , login with your account and go to "App registrations" under "Application".
    - Click on "New registration" and type any name for your application, select organizational directory and personal accounts option. Finally add "http://localhost:3000/admin/login" as the redirect URI and click save. You will get client ID, use that in the env key OUTLOOK_CLIENT_ID.
    - In the created registration, go to certificates and secrets and create a new client secret, copy the "Value" key and use that in the env key OUTLOOK_CLIENT_SECRET.
    - Next, Go to API permissions, click on "Add Permissions"-> "Microsoft Graph"->"Delegated Permissions", enable IMAP permissions, OpenId permissions, Mail and Mailboxes Permissions. You should be good to go.  

4. In root directory, run `docker compose up --build` to run the application first time, both react and node apps will be run, node.js port is taken from env, react runs on default port, takes some time to build (react app takes more time to start), run `docker compose up` if you want to run again in the future :).
5. You can now access your applications, 5601 for kibana, 3000 (default) react and 5000 from env for nodejs.
6. In the web, go to create account page, create your user (use password "Test@123" to fulfill regex validation), after successful creation you will be redirected to login page, login using the admin credentials(admin@gmail.com pass: admin). You will find your user in both dashboards.
7. Tocheck if sync is working, just change any mail in your outlook account status (read, flagged and so on) and it should be reflected in features page's expandable tables without reloading.
8. To add another user, logout, and repeat step 6 and 7. 
9. The urls are for the application pages are:

10. run `npm i` and `npm run doc` in root directory to generate a jsdoc, after generating, go to /server/v1/documentation/api directory and open index.html file for APIs documentation.


#### Admin Routes
- /admin/login Login admin,
- /admin/register Register Users,
- /admin/features
- /admin/members

### Happy Codding!

