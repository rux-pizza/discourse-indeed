/**
  This view is used for bootstrapping the pop-up indeed button

  @class IndeedButtonContainerView
  @extends Discourse.View
  @namespace Discourse
  @module Discourse
**/
Discourse.IndeedButtonContainerView = Discourse.View.extend({
    template: Em.Handlebars.compile('{{render indeedButton}}')
});

Discourse.TopicFooterButtonsView.reopen({
    addIndeedButton: function() {
        if(Discourse.User.current().enable_quoting){
            this.attachViewClass(Discourse.IndeedButtonContainerView);
        }
    }.on("additionalButtons")
});