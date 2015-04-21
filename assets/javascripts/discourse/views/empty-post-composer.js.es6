import ComposerView from 'discourse/views/composer';

export default ComposerView.reopen({
  emptyReplySave: (function(){
    var controller = this.get('controller');
    if(controller.get('emptyReplySave')){
      this.get('controller').save();
      controller.set('emptyReplySave', false)
    }
  }).on("previewRefreshed")

});

