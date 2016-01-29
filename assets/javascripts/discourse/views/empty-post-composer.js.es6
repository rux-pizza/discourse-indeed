import ComposerEditor from 'discourse/components/composer-editor';

export default ComposerEditor.reopen({
  emptyReplySave: (function(){
    // we use a container lookup to get a reference to the ComposerController
    // this might break at some point
    const controller = this.container.lookup('controller:composer');
    if(controller.get('emptyReplySave')){
      controller.save();
      controller.set('emptyReplySave', false)
    }
  }).on("previewRefreshed")

});

