import topicController from 'discourse/controllers/topic';

const emptyReplyText = '<span></span><span></span>';

export default topicController.reopen({

  replyToPostWithEmptyPost: function(post) {
    var composerController = this.get('controllers.composer');
    var quoteController = this.get('controllers.quote-button');

    var topic = post ? post.get('topic') : this.get('model');

    quoteController.set('buffer', '');

    if (composerController.get('content.topic.id') === topic.get('id') &&
      composerController.get('content.action') === Discourse.Composer.REPLY) {
      bootbox.alert(I18n.t('empty_reply.error.composer_open'));
      return false;
    } else {

      var opts = {
        action: Discourse.Composer.REPLY,
        draftKey: topic.get('draft_key'),
        draftSequence: topic.get('draft_sequence')
      };

      if(post && post.get("post_number") !== 1){
        opts.post = post;
      } else {
        opts.topic = topic;
      }

      var promise = composerController.open(opts);

      composerController.set('emptyReplySave', true);

      promise.then(function() {
        composerController.appendText(emptyReplyText);
      });
    }
    return false;
  }
});
