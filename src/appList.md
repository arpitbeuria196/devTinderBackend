authRouter
Post/Sign up
Post/login
post/logout

profileRouter
Get/profile/view
PATCH/profile/edit
patch/profile/password

/ConnectionRequestRouter
Post/request/send/interested/:userId
post/request/send/ignored/:userId
post/request/review/accepted/:requestId
post/request/review/rejected/:requestId


userRouter
GET user/connections
GET user/requests/received
Get user/feed



status->
ignored
intereseted
accepted
Rejected