import QuoteButtonController from 'discourse/controllers/quote-button';

export default QuoteButtonController.extend({

  // Save the currently selected text and displays the
  //  "indeed reply" button
  selectText(postId) {
    // anonymous users cannot "quote-reply"
    if (!this.currentUser) return;

    // don't display the "quote-reply" button if we can't reply
    const topicDetails = this.get('controllers.topic.model.details');
    if (!(topicDetails.get('can_reply_as_new_topic') || topicDetails.get('can_create_post'))) {
      return;
    }

    const selection = window.getSelection();
    // no selections
    if (selection.rangeCount === 0) return;

    // retrieve the selected range
    const range = selection.getRangeAt(0),
      cloned = range.cloneRange(),
      $ancestor = $(range.commonAncestorContainer);

    if ($ancestor.closest('.cooked').length === 0) {
      this.set('buffer', '');
      return;
    }

    const selectedText = Discourse.Utilities.selectedText();
    if (this.get('buffer') === selectedText) return;

    // we need to retrieve the post data from the posts collection in the topic controller
    const postStream = this.get('controllers.topic.postStream');
    this.set('post', postStream.findLoadedPost(postId));
    this.set('buffer', selectedText);

    // create a marker element
    const markerElement = document.createElement("span");
    // containing a single invisible character
    markerElement.appendChild(document.createTextNode("\u{feff}"));

    // collapse the range at the beginning/end of the selection
    range.collapse(!Discourse.Mobile.isMobileDevice);
    // and insert it at the start of our selection range
    range.insertNode(markerElement);

    // retrieve the position of the market
    const markerOffset = $(markerElement).offset(),
      $indeedButton = $('.indeed-button');

    // remove the marker
    markerElement.parentNode.removeChild(markerElement);

    // work around Chrome that would sometimes lose the selection
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(cloned);

    // move the indeed button above the marker
    Em.run.schedule('afterRender', function() {
      let topOff = markerOffset.top;
      let leftOff = markerOffset.left + 100;

      if (Discourse.Mobile.isMobileDevice) {
        topOff = topOff + 20;
        leftOff = Math.min(leftOff + 10, $(window).width() - $indeedButton.outerWidth());
      } else {
        topOff = topOff - $indeedButton.outerHeight() - 5;
      }

      $indeedButton.offset({ top: topOff, left: leftOff });
    });
  },

  indeedText() {
    this.quoteText();
    composerController = this.get('controllers.composer');
    composerController.appendText(I18n.t('indeed_reply.text');
  }
});
