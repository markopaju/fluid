var OYE = {};
OYE.properties = {
	isIE8: /msie|MSIE 8/.test(navigator.userAgent),
	tabletWidth: 800,
	mobileWidth: 640,
	winWidth: 0
};
OYE.objects = {};
OYE.errorMessages = {
	requiredField: 'This is a required field.',
	requiredRadio: 'Please select one of these options.',
	invalidEmail: 'Please enter an email address.',
	invalidNumber: 'Please enter a number.',
	invalidUrl: 'Please enter a URL.',
	invalidPattern: 'Please match the requested format.',
	invalidDate: 'Please enter a valid value. The field is incomplete or has an invalid date.'
};

OYE._IsAttributeSupported = function(tagName, attrName){
    var val = false;
    var input = document.createElement(tagName);
    if (attrName in input)
        val = true;
    delete input;
    return val;
};

OYE._IsTypeSupported = function(type){
    var input = document.createElement("input");
	input.setAttribute('type', type);
    delete input;
    return input.type !== 'text';
};

OYE._insertBefore = function( newElement, beforeElement ){
	beforeElement.parentNode.insertBefore(newElement, beforeElement);
};

OYE._insertAfter = function( newElement, afterElement ){
	afterElement.parentNode.insertBefore(newElement, afterElement.nextSibling);
};

OYE._getElementsByClass = function( searchClass, node, tag ){
	var classElements = new Array();
	if( node == null ) node = document;
	if( tag == null ) tag = '*';
	var els = node.getElementsByTagName(tag);
	var elsLen = els.length;
	var pattern = new RegExp("(^|\\s)"+searchClass+"(\\s|$)");
	for( i = 0, j = 0; i < elsLen; i++ ){
		if( pattern.test(els[i].className) ){
			classElements[j] = els[i];
			j++;
		}
	}
	return classElements;
};

OYE._isEmail = function(data){
    return /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(data);
};

OYE._isNumber = function(data){
    return !isNaN(data);
};

OYE._isURL = function(data){
	return new RegExp('^(https?:\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$','i').test(data);
};

OYE._addBodyClass = function(){
	if( ( OYE.properties.winWidth > OYE.properties.mobileWidth ) && ( OYE.properties.winWidth <= OYE.properties.tabletWidth ) )
		jQuery('body').addClass('view-tablet').removeClass('view-mobile');
	else if( OYE.properties.winWidth <= OYE.properties.mobileWidth )
		jQuery('body').addClass('view-mobile').removeClass('view-tablet');
	else
		jQuery('body').removeClass('view-mobile').removeClass('view-tablet');
};

OYE._initNavigation = function(){
	var items = jQuery('.object-handle');
	
	if( items && items.length ){
		items.on('click', function(event){
			event.preventDefault();
			
			jQuery('body').toggleClass(jQuery(this).data('class'));
		});
	}
};

OYE._repositionContent = function(){
	if( OYE.properties.winWidth <= OYE.properties.mobileWidth )
		jQuery('#content').after(jQuery('#leftbar'));
	else
		jQuery('#content').before(jQuery('#leftbar'));
	
	jQuery('#leftbar').after(jQuery('#rightbar'));
};

OYE._drawError = function(obj, error){
	var parent = obj.parent();
	var popup = parent.find('label.tooltip-error');
	var id;
	
	if( error ){
		if( popup ) popup.remove();
		if( obj.attr('type') == 'radio' || obj.attr('type') == 'checkbox' ){
			id = '';
		}else{
			id = 'for="' + obj.attr('id') + '"';
		}
		
		popup = jQuery('<label ' + id + ' class="tooltip-error">' + error + '</label>');
		var top = obj.outerHeight();
		parent.css('position', 'relative');
		popup.css({'top': top});
		parent.append(popup);
	}else{
		parent.css('position', '');
		if( popup ) popup.remove();
	}
	
	popup.on('click', function(event){
		jQuery(this).remove();
	});
};

OYE._handleError = function(obj, error){
	var label = jQuery('label[for='+obj.attr('id')+']');
	
	if( error ){
		obj.addClass('error');
		label.addClass('error');
		OYE._drawError(obj, error);
	}else{
		obj.removeClass('error');
		label.removeClass('error');
		OYE._drawError(obj);
	}
};

OYE._validateForm = function(){
	jQuery('form [type="submit"]').on('click', function(event){
		event.preventDefault();
		
		var form = jQuery(this).parents('form');
		var items = form.find('input, textarea, select');
		
		items.each(function(index){
			var that = jQuery(this);
			
			if( that.attr('required') ){
				if( !that.val() ){
					OYE._handleError(that, OYE.errorMessages.requiredField);
				}
				
				if( that.attr('type') == 'radio' || that.attr('type') == 'checkbox' || that.attr('required') ){
					var name = that.attr('name');
					var radios = jQuery('input[name=' + name + ']');
					var checked = radios.filter(':checked').val();
					
					that.change(
						function(){
							for(var i = 0; i < radios.length; i++){
								OYE._handleError(jQuery(radios[i]));
							}
						}
					);
					
					if( checked ){
						OYE._handleError(that);
					}else{
						OYE._handleError(that, OYE.errorMessages.requiredRadio);
					}
				}else if( that.attr('type') == 'email' ){
					if( OYE._isEmail(that.val()) ){
						OYE._handleError(that);
					}else{
						OYE._handleError(that, OYE.errorMessages.invalidEmail);
					}
				}else if( that.attr('type') == 'number' ){
					if( OYE._isNumber(that.val()) ){
						OYE._handleError(that);
					}else{
						OYE._handleError(that, OYE.errorMessages.invalidNumber);
					}
				}else if( that.attr('type') == 'url' ){
					if( OYE._isURL(that.val()) ){
						OYE._handleError(that);
					}else{
						OYE._handleError(that, OYE.errorMessages.invalidUrl);
					}
				}
				
				
				
			}
			
			that.keyup(function(event){
				var obj = jQuery(this);
				
                if( obj.attr('required') ){
					if( obj.val() ){
						OYE._handleError(obj);
					}else{
						OYE._handleError(obj, OYE.errorMessages.requiredField);
					}
				}
            });
			
			that.focusout(function(){
				var obj = jQuery(this);
				
				if( obj.attr('type') == 'email' ){
					if( OYE._isEmail(obj.val()) ){
						OYE._handleError(obj);
					}else{
						OYE._handleError(obj, OYE.errorMessages.invalidEmail);
					}
				}
				
				if( obj.attr('type') == 'number' ){
					if( OYE._isNumber(obj.val()) ){
						OYE._handleError(obj);
					}else{
						OYE._handleError(obj, OYE.errorMessages.invalidNumber);
					}
				}
				
				if( obj.attr('type') == 'url' ){
					if( OYE._isURL(obj.val()) ){
						OYE._handleError(obj);
					}else{
						OYE._handleError(obj, OYE.errorMessages.invalidUrl);
					}
				}
			});
		});
	});
};

OYE._createInputs = function(){
	var items = jQuery('input');
	
	if( !OYE._IsTypeSupported('date') ){
		var items = jQuery('input[type=date]');
		
		items.each(function(index){
			var obj = jQuery(this);
			
			obj.datepicker();
		});
	}
	
	if( !OYE._IsTypeSupported('number') ){
		var items = jQuery('input[type=number]');
		
		items.each(function(index){
			var obj = jQuery(this);
			
			obj.spinner({  
				min: parseInt(obj.attr('min')),
      			max: parseInt(obj.attr('max')),
				step: parseInt(obj.attr('step'))
			});
		});
	}
	
	if( !OYE._IsTypeSupported('range') ){
		var items = jQuery('input[type=range]');
		
		items.each(function(index){
			var obj = jQuery(this);
			var slider = jQuery('<div id="' + obj.attr('id') + '-slider"></div>');
			obj.after(slider).hide();  
			
			slider.slider({
				min: parseInt(obj.attr('min')),
      			max: parseInt(obj.attr('max')),
				step: parseInt(obj.attr('step')),
				value: parseInt(obj.val()),
				slide: function( event, ui ) {
					obj.val( ui.value );
				}
			});
		});
	}
};

OYE._init = function(){
	OYE.properties.winWidth = window.innerWidth || document.documentElement.clientWidth;
	
	OYE._addBodyClass();
	OYE._initNavigation();
	OYE._repositionContent();
	OYE._createInputs();
	OYE._validateForm();
	
	OYE._tabs();
	OYE._accordion();
	OYE._carousel();
	
	window.onresize = function(){
		OYE.properties.winWidth = window.innerWidth || document.documentElement.clientWidth;
		OYE._addBodyClass();
		OYE._repositionContent();
	};
};

if( window.attachEvent ){
	window.attachEvent('onload', OYE._init );
}else{
	window.onload = OYE._init;
}