/*global assetPath:true */

/**
  This controller supports the pop up indeed button

  @class IndeedButtonController
  @extends Discourse.Controller
  @namespace Discourse
  @module Discourse
**/

Discourse.IndeedButtonController = Discourse.Controller.extend({
  needs: ['topic', 'composer'],

  init: function() {
    this._super();
    $LAB.script(assetPath('defer/html-sanitizer-bundle'));
  },

  /**
    If the buffer is cleared, clear out other state (post)
  **/
  bufferChanged: function() {
    if (this.blank('buffer')) this.set('post', null);
  }.observes('buffer'),

  /**
    Save the currently selected text and displays the
    "indeed reply" button

    @method selectText
  **/
  selectText: function(postId) {
    // anonymous users cannot "indeed-reply"
    if (!Discourse.User.current()) return;

    // don't display the "indeed-reply" button if we can't create a post
    if (!this.get('controllers.topic.model.details.can_create_post')) return;

    var selection = window.getSelection();
    // no selections
    if (selection.rangeCount === 0) return;

    // retrieve the selected range
    var range = selection.getRangeAt(0),
        cloned = range.cloneRange(),
        $ancestor = $(range.commonAncestorContainer);

    if ($ancestor.closest('.cooked').length === 0) {
      this.set('buffer', '');
      return;
    }

    var selectedText = Discourse.Utilities.selectedText();
    if (this.get('buffer') === selectedText) return;

    // we need to retrieve the post data from the posts collection in the topic controller
    var postStream = this.get('controllers.topic.postStream');
    this.set('post', postStream.findLoadedPost(postId));
    this.set('buffer', selectedText);

    // collapse the range at the beginning of the selection
    // (ie. moves the end point to the start point)
    range.collapse(true);

    // create a marker element
    var markerElement = document.createElement("span");
    // containing a single invisible character
    markerElement.appendChild(document.createTextNode("\ufeff"));
    // and insert it at the beginning of our selection range
    range.insertNode(markerElement);

    // retrieve the position of the market
    var markerOffset = $(markerElement).offset(),
        $indeedButton = $('.indeed-button');

    // remove the marker
    markerElement.parentNode.removeChild(markerElement);

    // work around Chrome that would sometimes lose the selection
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(cloned);

    // move the indeed button above the marker
    Em.run.schedule('afterRender', function() {
      $indeedButton.offset({
        top: markerOffset.top - $indeedButton.outerHeight() - 5,
        left: markerOffset.left + 150
      });
    });
  },

  /**
    Indeed the currently selected text

    @method indeedText
  **/
  indeedText: function() {
    var post = this.get('post');
    var composerController = this.get('controllers.composer');
    var composerOpts = {
      action: Discourse.Composer.REPLY,
      draftKey: this.get('post.topic.draft_key')
    };

    if(post.get('post_number') === 1) {
      composerOpts.topic = post.get("topic");
    } else {
      composerOpts.post = post;
    }

    // If the composer is associated with a different post, we don't change it.
    var composerPost = composerController.get('content.post');
    if (composerPost && (composerPost.get('id') !== this.get('post.id'))) {
      composerOpts.post = composerPost;
    }

    var buffer = this.get('buffer');
    var indeeddText = Discourse.Quote.build(post, buffer)+'indeed';
    composerOpts.quote = indeeddText;
    if (composerController.get('content.viewOpen') || composerController.get('content.viewDraft')) {
      composerController.appendText(indeeddText);
    } else {
      composerController.open(composerOpts).then(
              function(){
                  composerController.save()
              }
          );
    }

    this.set('buffer', '');
    return false;
  },

  /**
    Deselect the currently selected text

    @method deselectText
  **/
  deselectText: function() {
    // clear selected text
    window.getSelection().removeAllRanges();
    // clean up the buffer
    this.set('buffer', '');
  }

});
