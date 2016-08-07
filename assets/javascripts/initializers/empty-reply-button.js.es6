import EmptyPostTopicController from "discourse/plugins/discourse-indeed/discourse/controllers/empty-post-topic";
import EmptyPostComposerView from "discourse/plugins/discourse-indeed/discourse/views/empty-post-composer";

import { withPluginApi } from 'discourse/lib/plugin-api';

function initializePlugin(api){
  api.addPostMenuButton('emptyReply', (attrs) => {
      if (!attrs.canCreatePost) return;
      return {
        action: 'emptyReply',
        icon: 'circle-o',
        className: '',
        title: 'empty_reply.action',
        position: 'first'
      };
    }
  );
  api.attachWidgetAction('post-menu', 'emptyReply', function(){
    const topicController = this.container.lookup('controller:topic');
    const post = topicController.get('model.postStream.posts').findBy('post_number', this.attrs.post_number);
    topicController.replyToPostWithEmptyPost(post);
  });
}

export default {
  name: 'discourse-indeed',

  initialize: function (container) {
    withPluginApi('0.5', initializePlugin);
  }
};



