## DB Scheema

<p align="center">
  <img src="images/mytraining.drawio (2).png" width="700" alt="Nest Logo" />
</p>

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.
This is a small project for writing reports, there are two table (users, reports)
User can login and create his report (with relation one user can create many reports [one-many])
1. Create dashboard, each user has one dashboard, each dashboard has multiple reports
2. User can share his dashboard with other users.
3. Other users can view and update the reports in the dashboard but cannot delete it.
4. The owner cannot remove & add other users to his dashboard  

1. Dashboard owner can send broadcast messages to all Dashboard shared users 
2. When the shared user replies, we want one-to-one conversation between the shared user and owner
3. A new conversation will appear between the owner & the shared user
4. If the shared user is removed, they will lose the chat from their side
5. But, it will remain with the owner 
6. The owner can create new group messages with any users 
7. If all users removed from the group the conversation will deleted with all its messages
8. Whene owner remove shared user from the dashboard all its conversation will deleted with its messages
9. The user can remove hisself from the group
It supported CRUD function (create, update, delete and retrive) for two models [user, report]
The password is encrypted using bcrytjs library
The project 
  use soft delete: createdAt, updatedAt, deletedAt, createdBy, updatedBy, deletedBy
  logger
  public decorator
