OYE._accordion = function(){
	var holders = jQuery('div.accordion');
	
	if( holders && holders.length ){
		var items = jQuery('div.handle', holders);
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