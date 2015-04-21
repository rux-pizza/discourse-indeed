import PostMenuView from "discourse/views/post-menu";
import { Button }  from "discourse/views/post-menu";

export default PostMenuView.reopen({
  buttonForEmptyReply: function (post, buffer) {
    return new Button("emptyReply", I18n.t("empty_reply.action"), 'circle-o');
  },

  clickEmptyReply: function () {
    this.get('controller').replyToPostWithEmptyPost(this.get('post'));
  }
});
