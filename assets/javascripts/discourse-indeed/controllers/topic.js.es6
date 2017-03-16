import topicController from 'discourse/controllers/topic';
import Composer from 'discourse/models/composer';
import Quote from 'discourse/lib/quote';
import QuoteState from 'discourse/lib/quote-state';

const emptyReplyText = '<span></span><span></span>';

export default topicController.reopen({

  initIndeedState: function(){
    this.set('indeedState', new QuoteState());
  }.on('init'),

  // Post related methods
  replyToPost(post) {
    const composerController = this.get('composer');
    const topic = post ? post.get('topic') : this.get('model');

    const indeedState = this.get('quoteState');
    const postStream = this.get('model.postStream');
    const quotedPost = postStream.findLoadedPost(indeedState.postId);
    const quotedText = Quote.build(quotedPost, indeedState.buffer);

    indeedState.clear();

    if (composerController.get('content.topic.id') === topic.get('id') &&
      composerController.get('content.action') === Composer.REPLY) {
      composerController.set('content.post', post);
      composerController.set('content.composeState', Composer.OPEN);
      this.appEvents.trigger('composer:insert-text', quotedText.trim());
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

      composerController.open(opts);
    }
    return false;
  },

  actions: {
    indeedText(postId, buffer) {
      return this.get('model.postStream').loadPost(postId).then(post => {
        const composer = this.get('composer');
        const viewOpen = composer.get('model.viewOpen');

        // If we can't create a post, delegate to reply as new topic
        if ((!viewOpen) && (!this.get('model.details.can_create_post'))) {
          this.send('indeedAsNewTopic', post);
          return;
        }

        const composerOpts = {
          action: Composer.REPLY,
          draftKey: post.get('topic.draft_key')
        };

        if (post.get('post_number') === 1) {
          composerOpts.topic = post.get("topic");
        } else {
          composerOpts.post = post;
        }

        // If the composer is associated with a different post, we don't change it.
        const composerPost = composer.get('model.post');
        if (composerPost && (composerPost.get('id') !== this.get('post.id'))) {
          composerOpts.post = composerPost;
        }

        const quotedText = Quote.build(post, buffer) + I18n.t('indeed_reply.text');
        composerOpts.quote = quotedText;
        if (composer.get('model.viewOpen')) {
          this.appEvents.trigger('composer:insert-text', quotedText);
        } else if (composer.get('model.viewDraft')) {
          const model = composer.get('model');
          model.set('reply', model.get('reply') + quotedText);
          composer.send('openIfDraft');

        } else {
          composer.open(composerOpts);
        }
      });
    },
    indeedAsNewTopic(post) {
      const composerController = this.get('composer');

      const { indeedState } = this;
      const quotedText = Quote.build(post, indeedState.buffer) + I18n.t('indeed_reply.text');
      indeedState.clear();

      composerController.open({
        action: Composer.CREATE_TOPIC,
        draftKey: Composer.REPLY_AS_NEW_TOPIC_KEY,
        categoryId: this.get('model.category.id')
      }).then(() => {
        return Em.isEmpty(quotedText) ? "" : quotedText;
      }).then(q => {
        const postUrl = `${location.protocol}//${location.host}${post.get('url')}`;
        const postLink = `[${Handlebars.escapeExpression(this.get('model.title'))}](${postUrl})`;
        composerController.get('model').prependText(`${I18n.t("post.continue_discussion", { postLink })}\n\n${q}`, {new_line: true});
      });
    },

    replyToPostWithEmptyPost: function(post) {
      const composerController = this.get('composer');
      const topic = post ? post.get('topic') : this.get('model');

      const indeedState = this.get('quoteState');
      const postStream = this.get('model.postStream');
      const quotedPost = postStream.findLoadedPost(indeedState.postId);
      const quotedText = Quote.build(quotedPost, indeedState.buffer);

      indeedState.clear();

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
    }
  }
});
