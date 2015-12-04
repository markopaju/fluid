OYE._accordion = function(){
	var holders = OYE._getElementsByClass( 'accordion', document, 'div');
	
	if( holders.length ){
		for( var i = 0; i < holders.length; i++ ){
			var items = OYE._getElementsByClass( 'handle', holders[i], 'div');
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