Discourse.TopicController.reopen({
// Post related methods
    replyToPostWithEmptyPost: function(post) {
        var composerController = this.get('controllers.composer');
        var quoteController = this.get('controllers.quoteButton');

        var topic = post ? post.get('topic') : this.get('model');

        quoteController.set('buffer', '');

        if (composerController.get('content.topic.id') === topic.get('id') &&
            composerController.get('content.action') === Discourse.Composer.REPLY) {
            bootbox.alert('Error: cannot empty-reply while you have post draft in progress. Please close or finish your draft first.');
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
            promise.then(function() { composerController.appendText('<span></span>'); composerController.save(); });
        }
        return false;
    }
});


Discourse.PostMenuView.reopen({
    renderEmptyReply: function(post, buffer){
        buffer.push('<button title="reply with an empty post" data-action="emptyReply" class="empty-reply">');
        buffer.push('<i class="fa fa-circle-o"></i>');
        buffer.push('</button>');
    },
    clickEmptyReply: function(){
        this.get('controller').replyToPostWithEmptyPost(this.get('post'));
    }
});