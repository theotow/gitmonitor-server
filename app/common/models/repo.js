module.exports = function(Repo) {
  Repo.disableRemoteMethod("upsert", true);
  Repo.disableRemoteMethod("updateAll", true);

  Repo.disableRemoteMethod("find", true);
  Repo.disableRemoteMethod("findOne", true);

  Repo.observe('before save', function(modelInstance, next) {
    if (modelInstance.instance) {
      modelInstance.instance.updateTime = new Date();
    } else {
      modelInstance.data.updateTime = new Date();
    }
    next();
  });

  Repo.disableRemoteMethod("confirm", true);
  Repo.disableRemoteMethod("count", true);
  Repo.disableRemoteMethod("exists", true);
  Repo.disableRemoteMethod("resetPassword", true);

  Repo.disableRemoteMethod('__count__accessTokens', false);
  Repo.disableRemoteMethod('__create__accessTokens', false);
  Repo.disableRemoteMethod('__delete__accessTokens', false);
  Repo.disableRemoteMethod('__destroyById__accessTokens', false);
  Repo.disableRemoteMethod('__findById__accessTokens', false);
  Repo.disableRemoteMethod('__get__accessTokens', false);
  Repo.disableRemoteMethod('__updateById__accessTokens', false);
  Repo.disableRemoteMethod('createChangeStream', true);
};
