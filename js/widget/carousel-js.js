OYE._carousel = function(){
	var carousels = OYE._getElementsByClass( 'carousel', document, 'div');
	var firstRun = true,
	pages,
	current,
	autoSlideTimer,
	canSlide = true,
	playPause = false,
	itemsPerPage = 1,
	animationSpeed = 1000,
	autoSlide = 0;
	
	init = function(){
		if( carousels && carousels.length ){
			for( var i = 0; i < carousels.length; i++ ){
				if( carousels[i].getAttribute('data-itemsPerPage') && OYE.properties.winWidth > OYE.properties.mobileWidth ) carousels[i].itemsPerPage = carousels[i].getAttribute('data-itemsPerPage');
				else carousels[i].itemsPerPage = itemsPerPage;
				
				if( carousels[i].getAttribute('data-animationSpeed') ) carousels[i].animationSpeed = carousels[i].getAttribute('data-animationSpeed');
				else carousels[i].animationSpeed = animationSpeed;
				
				if( carousels[i].getAttribute('data-autoSlide') ) carousels[i].autoSlide = carousels[i].getAttribute('data-autoSlide');
				else carousels[i].autoSlide = autoSlide;
				
				if( carousels[i].getAttribute('data-playPause') ) carousels[i].playPause = carousels[i].getAttribute('data-playPause');
				else carousels[i].playPause = playPause;
				
				var list = OYE._getElementsByClass( 'list', carousels[i], 'ul');
				if( list && list.length ){
					carousels[i].list = list;
					var slides = OYE._getElementsByClass( 'slide', carousels[i], 'li');
					if( slides && slides.length ){
						carousels[i].slides = slides;
						_setDimensions(carousels[i]);
						current = 0;
						pages = Math.ceil(slides.length/carousels[i].itemsPerPage);
						
						if( pages > 1 && firstRun ){
							_createPager(carousels[i]);
							_createPrevNextArrows(carousels[i]);
						}
						
						if( carousels[i].autoSlide && canSlide ) _addAutoSlide(carousels[i]);
					}
				}
			}
		}
		
		jQuery(window).resize(function(){
			if( carousels && carousels.length ){
				for( var i = 0; i < carousels.length; i++ ){
					if( OYE.properties.winWidth > OYE.properties.mobileWidth ) carousels[i].itemsPerPage = carousels[i].getAttribute('data-itemsPerPage');
					else carousels[i].itemsPerPage = itemsPerPage;
					
					_setDimensions(carousels[i]);
					current = 0;
					pages = Math.ceil(carousels[i].slides.length/carousels[i].itemsPerPage);
					
					if( pages > 1 ){
						_createPager(carousels[i]);
					}
				}
			}
		})
		
		firstRun = false;
	};
	
	_resetDimensions = function(carousel){
		carousel.style.width = '100%';
		carousel.list[0].style.left = 0;
	};
	
	_setDimensions = function(carousel){
		_resetDimensions(carousel);
		carousel.style.width = carousel.offsetWidth + 'px';
		
		for( var i = 0; i < carousel.slides.length; i++ ){
			carousel.slides[i].style.width = (carousel.offsetWidth / carousel.itemsPerPage) + 'px';
		}
		carousel.list[0].style.width = (carousel.slides.length * carousel.slides[0].offsetWidth) + 'px';
		carousel.list[0].style.left = 0;
		carousel.style.height = carousel.slides[0].offsetHeight + 'px';
		carousel.slideWidth = carousel.slides[0].offsetWidth + 'px';
		console.log(carousel.list[0].style.width);
	};
	
	_playPrevious = function(){
		if( current != 0 ) current--;
		else current = pages - 1;
		_startAnimation(carousel);
	};
	
	_playNext = function(carousel){
		if( current < pages - 1 ) current++;
		else current = 0;
		_startAnimation(carousel);
	};
	
	_addAutoSlide = function(carousel){
		clearTimeout(autoSlideTimer);
		autoSlideTimer = setTimeout(function(){
			_playNext(carousel);
		},carousel.autoSlide);
	};
	
	_startAnimation = function(carousel){
		if( carousel.autoSlide && canSlide ) _addAutoSlide(carousel);
		
		var left = -(current * parseInt(carousel.slideWidth) * carousel.itemsPerPage);
		var list = OYE._getElementsByClass( 'list', carousel, 'ul')[0];
		list.style.left = left + 'px';
		//list.stop().animate({ left: -left }, carousel.animationSpeed );
		
		_resetActivePage(carousel);
	};
	
	_resetActivePage = function(carousel){
		var pager = OYE._getElementsByClass( 'carousel-pager', carousel, 'ul');
		
		if( pager && pager.length ){
			var items = OYE._getElementsByClass( 'page', carousel, 'li');
			
			for( var i = 0; i < items.length; i++ ){
				if( i == current ) OYE._addClass(items[i], 'active');
				else OYE._removeClass(items[i], 'active');
			}
		}
	};
	
	_createPager = function(carousel){
		var pager = OYE._getElementsByClass( 'carousel-pager', carousel, 'ul');
		
		if( pager && pager.length ) carousel.removeChild(pager[0]);
		var holder = document.createElement('ul');
		holder.className = 'carousel-pager';
		carousel.appendChild(holder);
		
		for( var i = 0; i < pages; i++ ){
			var obj = document.createElement('li');
			obj.className = 'page';
			obj.setAttribute('data-id', i);
			obj.innerHTML = (i + 1);
			holder.appendChild(obj);
			
			obj.onclick = function(){
				if( current != this.getAttribute('data-id') ){
					current = this.getAttribute('data-id');
					_startAnimation(carousel);
				}
				
				return false;
			};
		}
		
		_resetActivePage(carousel);
		
		if( carousel.playPause && carousel.autoSlide ){
			var obj = document.createElement('li');
			obj.className = 'play-pause';
			OYE._addClass(obj, 'pause');
			holder.appendChild(obj);
			
			obj.onclick = function(){
				if( OYE._hasClass(this, 'pause') ){
					canSlide = false;
					clearTimeout(autoSlideTimer);
					OYE._removeClass(this, 'pause');
					OYE._addClass(this, 'play');
				}else{
					canSlide = true;
					_addAutoSlide(carousel.autoSlide);
					OYE._removeClass(this, 'play');
					OYE._addClass(this, 'pause');
				}
				
				return false;
			};
		}
		
		var width = holder.getElementsByTagName('li').length * OYE._getStyle(holder.getElementsByTagName('li')[0], 'width') + ( OYE._getStyle(holder.getElementsByTagName('li')[0], 'margin-left') + OYE._getStyle(holder.getElementsByTagName('li')[0], 'margin-right') ) * holder.getElementsByTagName('li').length;
		holder.style.width = width + 'px';
		holder.style.marginLeft = -( width / 2 ) + 'px';
		holder.style.left = '50%';
	};
	
	_createPrevNextArrows = function(carousel){
		var prev = document.createElement('div');
		var next = document.createElement('div');
		prev.className = 'prev-page';
		next.className = 'next-page';
		
		carousel.appendChild(prev);
		carousel.appendChild(next);
		
		prev.onclick = function(){
			_playPrevious(carousel);
			
			return false;
		};
		
		next.onclick = function(){
			_playNext(carousel);
			
			return false;
		};
	};
	
	init();
};