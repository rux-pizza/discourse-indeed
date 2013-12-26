/**
  This view is used for rendering the pop-up indeed button

  @class IndeedButtonView
  @extends Discourse.View
  @namespace Discourse
  @module Discourse
**/
Discourse.IndeedButtonView = Discourse.View.extend({
  classNames: ['indeed-button'],
  classNameBindings: ['visible'],
  isMouseDown: false,
  isTouchInProgress: false,

  /**
    Determines whether the pop-up indeed button should be visible.
    The button is visible whenever there is something in the buffer
    (ie. something has been selected)

    @property visible
  **/
  visible: Em.computed.notEmpty('controller.buffer'),

  /**
    Renders the pop-up indeed button.

    @method render
  **/
  render: function(buffer) {
    buffer.push('<i class="fa fa-thumbs-up"></i>&nbsp;&nbsp;');
    buffer.push('indeed');
  },

  /**
    Binds to the following global events:
      - `mousedown` to clear the indeed button if they click elsewhere.
      - `mouseup` to trigger the display of the indeed button.
      - `selectionchange` to make the selection work under iOS

    @method didInsertElement
  **/
  didInsertElement: function() {
    var controller = this.get('controller'),
        view = this;

    $(document)
      .on("mousedown.indeed-button", function(e) {
        view.set('isMouseDown', true);
        // we don't want to deselect when we click on the indeed button or the reply button
        if ($(e.target).hasClass('indeed-button') || $(e.target).closest('.create').length > 0) return;
        // deselects only when the user left click
        // (allows anyone to `extend` their selection using shift+click)
        if (e.which === 1 && !e.shiftKey) controller.deselectText();
      })
      .on('mouseup.indeed-button', function(e) {
        view.selectText(e.target, controller);
        view.set('isMouseDown', false);
      })
      .on('touchstart.indeed-button', function(e){
        view.set('isTouchInProgress', true);
      })
      .on('touchend.indeed-button', function(e){
        view.set('isTouchInProgress', false);
      })
      .on('selectionchange', function() {
        // there is no need to handle this event when the mouse is down
        // or if there a touch in progress
        if (view.get('isMouseDown') || view.get('isTouchInProgress')) return;
        // `selection.anchorNode` is used as a target
        view.selectText(window.getSelection().anchorNode, controller);
      });
  },

  /**
    Selects the text

    @method selectText
  **/
  selectText: function(target, controller) {
    var $target = $(target);
    // breaks if quoting has been disabled by the user
    if (!Discourse.User.currentProp('enable_quoting')) return;
    // retrieve the post id from the DOM
    var postId = $target.closest('.boxed').data('post-id');
    // select the text
    if (postId) controller.selectText(postId);
  },

  /**
    Unbinds from global `mouseup, mousedown, selectionchange` events

    @method willDestroyElement
  **/
  willDestroyElement: function() {
    $(document)
      .off("mousedown.indeed-button")
      .off("mouseup.indeed-button")
      .off("touchstart.indeed-button")
      .off("touchend.indeed-button")
      .off("selectionchange");
  },

  /**
    Indeed the selected text when clicking on the indeed button.

    @method click
  **/
  click: function(e) {
    e.stopPropagation();
    return this.get('controller').indeedText(e);
  }

});

