import topicController from 'discourse/controllers/topic';
import Composer from 'discourse/models/composer';
import Quote from 'discourse/lib/quote';

const emptyReplyText = '<span></span><span></span>';

export default topicController.reopen({

  replyToPostWithEmptyPost: function(post) {
    const composerController = this.get('controllers.composer'),
      quoteController = this.get('controllers.quote-button'),
      quotedText = Quote.build(quoteController.get('post'), quoteController.get('buffer')),
      topic = post ? post.get('topic') : this.get('model');

    quoteController.set('buffer', '');

    if (composerController.get('content.topic.id') === topic.get('id') &&
      composerController.get('content.action') === Composer.REPLY) {
      bootbox.alert(I18n.t('empty_reply.error.composer_open'));
    } else {

      const opts = {
        action: Composer.REPLY,
        draftKey: topic.get('draft_key'),
        draftSequence: topic.get('draft_sequence')
      };

      if (quotedText) { opts.quote = quotedText; }

      if(post && post.get("post_number") !== 1){
        opts.post = post;
      } else {
        opts.topic = topic;
      }

      const promise = composerController.open(opts);

      composerController.set('emptyReplySave', true);

      promise.then(function() {
        composerController.get('model').appendText(emptyReplyText);
      });
    }
    return false;
  }
});
