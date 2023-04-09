db.createUser({
  user: 'emprendeSG',
  pwd: 'emprendeSG2023%',
  roles: [{ role: 'readWrite', db: 'emprendesg' }],
});
