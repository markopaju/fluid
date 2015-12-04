OYE._tabs = function(){
	var holders = jQuery('div.tabs');
	
	if( holders && holders.length ){
		var list = jQuery('ul.list', holders).first();
		var items = jQuery('a', list);
		var contents = jQuery('div.content', holders);
		
		items.removeClass('active').first().parent().addClass('active');
		contents.hide().first().show();
		
		if( items && items.length ){
			items.each(function(index){
				var obj = jQuery(contents[index]);
				
				if( obj && obj.length ){
					jQuery(this).on('click', function(event){
						event.preventDefault();
						
						items.parent().removeClass('active');
						jQuery(this).parent().addClass('active');
						contents.hide();
						obj.show();
					});
				}
			});
		}
	}
};