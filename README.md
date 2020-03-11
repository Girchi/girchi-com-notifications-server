# Notification API

Create .env

Example
```
PORT=3000
CONNECTION_STRING=mongodb://localhost:27017/notif
PUBLIC_KEY=/path/to/public.key
```

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
  "user": "uuid"
}
```

#### /notifications/user
Accepts GET request expecting jwt token in header and returns notifications for given user

Header Example
```
Authorization: Bearer "jwt token here"
```

#### /notifications/:id/read
Accepts POST request expecting jwt token and sets given notification to be read


#### /notifications/user/unread
Accepts GET request, returns all unread notifications by user
