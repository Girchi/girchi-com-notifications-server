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
  "title": "title",
  "title_en: "title_en",
  "desc": "description",
  "desc": "description_en",
  "type": "type of notification",
  "user": "uuid",
  "link": "https://girchi.com",
  "photoUrl": "https://girchi.com/avatar.png"
}
```

#### /notifications/user
Accepts GET request expecting jwt token in cookies and returns notifications for given user

#### /notifications/:id/read
Accepts POST request expecting jwt token in cookies and sets given notification to be read


#### /notifications/user/unread
Accepts GET request excepting jwt token in cookies, returns all unread notifications by user

#### /user/unread-count
Accepts GET request excepting jwt token in cookies, returns count ofr unread notifications