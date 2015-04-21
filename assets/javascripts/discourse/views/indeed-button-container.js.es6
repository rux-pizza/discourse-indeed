import TopicFooterButtonsView from "discourse/views/topic-footer-buttons";

var IndeedButtonContainerView = Discourse.View.extend({
  template: Em.Handlebars.compile('{{render "indeedButton"}}')
});

TopicFooterButtonsView.reopen({
  addIndeedButton: function () {
    if (Discourse.User.current().enable_quoting) {
      this.attachViewClass(IndeedButtonContainerView);
    }
  }.on("additionalButtons")
});

export default IndeedButtonContainerView;
