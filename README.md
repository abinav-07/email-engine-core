<!-- Use cmd+shift+v in macOS or ctrl+alt+v on windows to open as a preview -->
# Scrapper Extension 
Scrapper Extension using Node/Express.js and React.js, Sequelize and Jwts, manifest.json.
`Work Better in Mac, not tested in Windows(follow second last line if you are on windows and dont have docker)`

### CONFIGURATION

#### Admin Cred: admin@gmail.com admin

`NOTE: Seeder is already run along with migrations`

This section covers the process for configuring and installing the application packages.

- run `npm i` and `npm run doc` in root directory to generate a jsdoc, after generating, go to /server/v1/documentation/api directory and open index.html file for APIs documentation.

1. Install `Node.js v ^18.17.0` in your system. USe `nvm install ^18.17.0` and `nvm use 18.17.0`.
2. Install `docker` in your system.
3. Add `.env` to your `root` directory, It has exampleenv file, you can copy same values to .env.
4. Go to `./web` directory and run `npm run build` to generate the build for extension.
5. After building extension, go to your web browser and type `[yourbrowsername]://extensions` or go to extensions setting page, enable developer mode and click on load unpacked and select the `build` directory that we built inside web directory.
6. In root directory, run `docker compose up --build` to run the application, both react and node apps will be run, node.js port is taken from env, react runs on default port, takes some time to build (react app takes more time to start) :).
7. You can now access your applications, 5001 for database, 3000 (default) react and 5000 from env for nodejs.
8. To check if extension worked, open any product in your needed ecommerce website(tested in daraz and amazon). EG:
[Link To Amazon Product](https://www.amazon.com/Hoodies-Angeles-Sweatshirt-Pullover-Pockets/dp/B0CF9GFQHG/ref=sr_1_1?_encoding=UTF8&content-id=amzn1.sym.4f5febc6-20d8-4d1d-b839-2647181df110&dib=eyJ2IjoiMSJ9.nUDXeGwe_mbcDi_1o7ownVNCNUoDtk3gI9AGZsutt5WueMOuFb5UB6kl_8guR7_uq-IUT3RUerOhGnAOb2AZ-H23Fl2IMTDfmc-4fcvu1Aqc0F_DhNbPDUdkpukWg5siwrnhhTQNSMBxLr5QkE164s4vC5NvlcYAAmQHBIKDfWPa5HAb-JqFLi3-ahYya1oT6TH-bJnrr0Z2QXB7bsateut30c6KNCNpb0aE2q3evw7acLY4AyltCWFMPN92cXtWoWYRbHanuCZ22ypzsRVu_VPrs_dUN8TwBbrxPTwNDu8.ULFt2BQ6RC2vHxxN4q_N8TTHL6Du6vQW-JcsgV97Xnk&dib_tag=se&keywords=teen%2Bapparel&pd_rd_r=961126b3-dee5-4087-896d-0af58df9e64b&pd_rd_w=dZfO5&pd_rd_wg=S7jN6&pf_rd_p=4f5febc6-20d8-4d1d-b839-2647181df110&pf_rd_r=0WSM30JXF7CG743G1B26&qid=1716913831&sr=8-1&th=1)
9. You will see the scrapped data in admin dashboard page.
10. The urls are for the application pages are:
#### User Routes
- /register
#### Admin Routes
- /admin/login Login admin,
- /admin/features
- /admin/members

11. Register some users from /admin/register page, and then use admin dashboard using the email that was provided at the start to see atleast some user data in members tab.

`Final Note: If docker doesnt work for you and you are on windows, Follow Below:`

1. change env, set MY_SQL_PASSWORD= [empty] MY_SQL_HOST=localhost
2. copy envs in both web and server folders
3. Make sure mysql is up and running(mysql.server start) in terminal.
4. mysql -u root -h  in terminal to get inside mysql.
5. Create new DATABASE: CREATE DATABASE extension_scraping;
6. Finally, npm run start:win

### Happy Codding!

