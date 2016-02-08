module.exports = function(app) {
  var Repos = app.models.Repo;
  var Installations = app.models.installation;

  function insertDummyData(){
    Installations.upsert({
      'deviceToken': '8ec3bba7de23cda5e8a2726c081be79204faede67529e617b625c984d61cf5c3',
      'deviceType': 'ios',
      'id': 'installation1'
    }, function(err, installation){
      installation.repos.create({
        id: 'repo1',
        branch: 'refs/heads/master',
        name: 'Testdir1',
        author: 'Scott Chacon <schacon@gmail.com>',
        message: 'test',
        isClean: false,
        notified: false,
        branches: ['refs/heads/master'],
        status: {
          ahead: 0,
          behind: 0
        }
      }, function(){
        installation.repos.create({
          id: 'repo2',
          branch: 'refs/heads/master',
          name: 'Testdir2',
          author: 'Scott Chacon <schacon@gmail.com>',
          message: 'test',
          isClean: true,
          notified: false,
          branches: ['refs/heads/master'],
          status: {
            ahead: 0,
            behind: 0
          }
        }, function(){

        });
      });
    });
  }

  insertDummyData();
};
