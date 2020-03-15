# Notification API

Copy .env.dist to .env

Install dependencies and start the server
```
npm install
npm start
```


### Endpoints

#### /notifications
Accepts POST request and creates notification record giving json

Example
```
{
  "text": "note text",
  "user": "uuid",
  "link": "https://girchi.com",
  "photoUrl": "https://girchi.com/avatar.png"
}
```

#### /notifications/user
Accepts GET request expecting jwt token in cookies and returns notifications for given user

Header Example
```
Authorization: Bearer "jwt token here"
```

#### /notifications/:id/read
Accepts POST request expecting jwt token in cookies and sets given notification to be read


#### /notifications/user/unread
Accepts GET request excepting jwt token in cookies, returns all unread notifications by user
