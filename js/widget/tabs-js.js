OYE._tabs = function(){
	var holders = OYE._getElementsByClass( 'tabs', document, 'div');
	
	if( holders.length ){
		for( var i = 0; i < holders.length; i++ ){
			var list = OYE._getElementsByClass( 'list', holders[i], 'ul')[0];
			var items = list.getElementsByTagName('a');
			var contents = OYE._getElementsByClass( 'content', holders[i], 'div');
			
			if( items.length ){
				OYE._setActiveClass(items);
				OYE._setContentDisplay(contents);
				
				for( var j = 0; j < items.length; j++ ){
					items[j].index = j;
					items[j].onclick = function(){
						OYE._setActiveClass(items, this.index);
						OYE._setContentDisplay(contents, this.index);
						
						return false;
					};
				}
			}
		}
	}
};