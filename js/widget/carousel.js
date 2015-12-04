OYE._carousel = function(){
	var autoSlideTimer,
	canSlide = true,
	playPause = false,
	animationSpeed = 1000,
	autoSlide = 0;
	
	init = function(){
		var carousels = jQuery('div.carousel');
		
		if( carousels && carousels.length ){
			carousels.each(function(index){
				var obj = jQuery(this);
				
				if( obj.data('itemsperpage') && OYE.properties.winWidth > OYE.properties.mobileWidth )
					obj[0].itemsPerPage = obj.data('itemsperpage');
				else
					obj[0].itemsPerPage = 1;
				
				if( obj.data('animationspeed') )
					obj[0].animationSpeed = obj.data('animationspeed');
				else
					obj[0].animationSpeed = animationSpeed;
				
				if( obj.data('autoslide') )
					obj[0].autoSlide = obj.data('autoslide');
				else
					obj[0].autoSlide = autoSlide;
				
				if( obj.data('playpause') )
					obj[0].playPause = obj.data('playpause');
				else
					obj[0].playPause = playPause;
				
				if( obj.data('canslide') )
					obj[0].canSlide = obj.data('canslide');
				else
					obj[0].canSlide = canSlide;
				
				var list = jQuery('ul.list', obj);
				if( list && list.length ){
					var slides = jQuery('li.slide', obj);
					if( slides && slides.length ){
						_setDimensions(obj);
						obj[0].current = 0;
						obj[0].pages = Math.ceil(slides.length/obj[0].itemsPerPage);
						if( obj[0].pages > 1 ){
							_createPager(obj);
							_createPrevNextArrows(obj);
						}
						
						if( obj[0].autoSlide && obj[0].canSlide ) _addAutoSlide(obj);
					}
				}
			});
		}
		
		jQuery(window).resize(function(){
			if( carousels && carousels.length ){
				carousels.each(function(index){
					var obj = jQuery(this);
					
					if( ( OYE.properties.winWidth > OYE.properties.mobileWidth ) && ( OYE.properties.winWidth <= OYE.properties.tabletWidth ) ){
						obj[0].itemsPerPage = 2;
					}else if( OYE.properties.winWidth <= OYE.properties.mobileWidth ){
						obj[0].itemsPerPage = 1;
					}else{
						obj[0].itemsPerPage = obj.data('itemsperpage');
					}
					
					_setDimensions(obj);
					obj[0].current = 0;
					var slides = jQuery('li.slide', obj);
					obj[0].pages = Math.ceil(slides.length/obj[0].itemsPerPage);
					
					if( obj[0].pages > 1 ){
						_createPager(obj);
					}
				});
			}
		})
	};
	
	_setDimensions = function(obj){
		var list = jQuery('ul.list', obj);
		var slides = jQuery('li.slide', obj);
		
		obj.width('100%');
		jQuery('ul.list', obj).css('left', 0);
		obj.width(obj[0].offsetWidth);
		slides.width( obj[0].offsetWidth / obj[0].itemsPerPage );
		list.width(slides.length * slides[0].offsetWidth);
		obj.height(slides.first().height());
		obj.slideWidth = slides.first().width();
	};
	
	_playPrevious = function(obj){
		if( obj[0].current != 0 ) obj[0].current--;
		else obj[0].current = obj[0].pages - 1;
		_startAnimation(obj);
	};
	
	_playNext = function(obj){
		if( obj[0].current < obj[0].pages - 1 ) obj[0].current++;
		else obj[0].current = 0;
		_startAnimation(obj);
	};
	
	_addAutoSlide = function(obj){
		clearTimeout(obj[0].autoSlideTimer);
		obj[0].autoSlideTimer = setTimeout(function(){
			_playNext(obj);
		},obj[0].autoSlide);
	};
	
	_startAnimation = function(obj){
		if( obj[0].autoSlide && obj[0].canSlide ) _addAutoSlide(obj);
		
		var left = -(obj[0].current * jQuery('li.slide', obj).width() * obj[0].itemsPerPage);
		jQuery('ul.list', obj).stop().animate({ left: left }, obj[0].animationSpeed );
		
		_resetActivePage(obj);
	};
	
	_resetActivePage = function(obj){
		var pager = jQuery('ul.carousel-pager', obj);
		
		if( pager && pager.length ){
			var items = jQuery('li.page', pager);
			
			items.removeClass('active');
			jQuery(items[obj[0].current]).addClass('active');
		}
	};
	
	_createPager = function(obj){
		var pager = jQuery('ul.carousel-pager', obj);
		
		if( pager && pager.length ) pager.remove();
		pager = jQuery('<ul class="carousel-pager"></ul>');
		obj.append(pager);
		
		for( var i = 0; i < obj[0].pages; i++ ){
			var page = jQuery('<li class="page" data-id="' + i + '">' + (i + 1) + '</li>');
			pager.append(page);
			
			page.on('click', function(event){
				event.preventDefault();
				
				if( obj[0].current != jQuery(this).data('id') ){
					obj[0].current = jQuery(this).data('id');
					_startAnimation(obj);
				}
			});
		}
		
		_resetActivePage(obj);
		
		if( obj[0].playPause && obj[0].autoSlide ){
			var play = jQuery('<li class="play-pause pause"></li>');
			pager.append(play);
			
			play.on('click', function(event){
				event.preventDefault();
				
				if( jQuery(this).hasClass('pause') ){
					obj[0].canSlide = false;
					clearTimeout(obj[0].autoSlideTimer);
					jQuery(this).removeClass('pause').addClass('play');
				}else{
					obj[0].canSlide = true;
					_addAutoSlide(obj);
					jQuery(this).removeClass('play').addClass('pause');
				}
			});
		}
		
		var width = jQuery('li', pager).length * parseInt(jQuery('li', pager).first().width()) + ( parseInt(jQuery('li', pager).first().css('margin-left')) + parseInt(jQuery('li', pager).first().css('margin-right')) ) * jQuery('li', pager).length;
		pager.width(width);
		pager.css('margin-left', -( width / 2 ));
		pager.css('left', '50%');
	};
	
	_createPrevNextArrows = function(obj){
		var prev = jQuery('<div class="prev-page">Previous</div>');
		var next = jQuery('<div class="next-page">Next</div>');
		
		obj.append(prev);
		obj.append(next);
		
		prev.on('click', function(event){
			event.preventDefault();
			_playPrevious(obj);
		});
		
		next.on('click', function(event){
			event.preventDefault();
			_playNext(obj);
		});
	};
	
	init();
};