use admin
db.createUser({
  user: "{{ mongo.admin.user }}",
  pwd: "{{ mongo.admin.pass }}",
  roles: [{
    role: "userAdminAnyDatabase",
    db: "admin"
  }]
})

use saasbox-production
db.createUser({
  user: "saasbox",
  pwd: "EjizMwvmaeRDHtgZpKkyxAgiPJxjXbxraDi2bthygZo9TPGoPm",
  roles: [
    { role: "readWrite", db: "saasbox-production" }
  ]
})
