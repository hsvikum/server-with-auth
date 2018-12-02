module.exports = function (app) {
    
   app.service('users').find({
    query: {
      $sort: {
        createdAt: 1
      }
    }
  }).then(function(usersData) {
    let users  = usersData.data;
    let found = false;
  
    let nextUser = null;
    let currentUser = null;
    if(users.length > 1) {
        for(let i=0; i < users.length; i++) {
            if(users[i].active && !found) {
                found = true;
                currentUser = users[i];
                if (currentUser.active < Date.now()-15000) {
                  if(typeof users[i+1] != "undefined") {
                      users[i+1].active = Date.now();
                      nextUser = users[i+1];
                  } else {
                      users[0].active = Date.now();
                      nextUser = users[0]
                  }
                  console.log(nextUser);
                  currentUser.active = false;
                  app.service('users').update(currentUser._id, currentUser);
                  break;
                }
            } else {
                users[i].active = false;
                app.service('users').update(users[i]._id, users[i]);
            }
        }
    }
    if(users.length > 0) {
      if(!found) {
          users[0].active = Date.now();
          nextUser = users[0];
        }
        if (nextUser) {
          app.service('users').update(nextUser._id, nextUser);
        }
    }  
  });
};
