import PostMenuComponent from "discourse/components/post-menu";
import { Button }  from "discourse/components/post-menu";

export default PostMenuComponent.reopen({
  buttonForEmptyReply: function (post, buffer) {
    if (!this.get('canCreatePost')) return;
    return new Button("emptyReply", "empty_reply.action", 'circle-o');
  },

  clickEmptyReply: function (post) {
    // we use a container lookup to get a reference to the TopicController
    // this might break at some point
    this.container.lookup('controller:topic').replyToPostWithEmptyPost(post);
  }
});
