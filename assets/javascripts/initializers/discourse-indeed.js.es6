import ComposerEditorComponent from "../discourse-indeed/components/composer-editor";
import TopicController from "../discourse-indeed/controllers/topic";
import TopicRoute from "../discourse-indeed/routes/topic";

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
    const post = topicController.get('model.postStream').findLoadedPost(this.attrs.reply_to_post_number);
    topicController.send('replyToPostWithEmptyPost', post);
  });
}

export default {
  name: 'discourse-indeed',

  initialize: function (container) {
    withPluginApi('0.5', initializePlugin);
  }
};



