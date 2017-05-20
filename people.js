requirejs.config({
  paths: {
    ramda: 'https://cdnjs.cloudflare.com/ajax/libs/ramda/0.14.0/ramda.min',
    jquery: 'https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min',
		bootstrap: 'https://netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min'
	 }
});

require([
    'ramda',
    'jquery',
		'bootstrap'
  ],
  function (_, $) {

			//
		// <div>
		// 	<div class="name">
		// 		<p>title first last</p>
		//
		// 	</div>
		// </div>
		
    var Impure = {
      getJSON: _.curry(function(callback, url) {
        $.getJSON(url, callback)
      }),

      setHtml: _.curry(function(sel, html) {
        $(sel).html(html)
      })
    }
		
    var trace = _.curry(function(tag, x) {
        console.log(tag, x);
        return x;
    })
		
		const createList = () => {
			return $('<ul></ul>');
		}
		
		const appendToList = (container, value, tag) => {
			return $(container).append(`<div>${value}</div>`);
		}
		
		const append = (container, value) => {
			return $(container).append(value)
		}
		
		
		const createParagraph = () => {
			return $('<p></p>')
		}
		
		const createPersonContainer = '<div></div>'
		

		
    var img = function (url) {
       return $('<img />', { src: url });
    };
		
		/*
			<div class="row">
				<div class="col-sm-6 col-sm-offset-3 person-card grey-border">
					
					<div class="thumbnail pull-right">
					    <img src="https://randomuser.me/api/portraits/med/women/54.jpg">
					</div>
		      <div class="caption pull-left">
		        <h3>mrs alice smith</h3>
		        <p>content</p>
		    	</div>
			</div>
		*/
		
		const getTitle = _.compose(_.prop('title'), _.prop('name'));
		const getFirstName = _.compose(_.prop('first'), _.prop('name'));
		const getLastName = _.compose(_.prop('last'), _.prop('name'));
		const getThumbnail = _.compose(_.prop('thumbnail'), _.prop('picture'))
	
		const createName = (value) => {
			const title = getTitle(value)
			const firstName = getFirstName(value)
			const lastName = getLastName(value)
			return $(`<p class="person-name">${title} ${firstName} ${lastName}</p>`)
		}
		const createImage = _.compose(img, getThumbnail)
			
		const addParagraph = (accum, value) => {
			const element = createName(value)
			const image = createImage(value)
			append(element, image)				
			return append(accum, element)
		}
		
		const createPerson = _.compose(addParagraph)
		const people = _.compose(_.reduce(createPerson, createPersonContainer), _.prop('results'))
		const renderPeople = _.compose(Impure.setHtml('#list'), people)
		
    var url = function (t) {
      return 'https://randomuser.me/api/?results=5';
    };
		
		var app = _.compose(Impure.getJSON(renderPeople), url)
		
		app("people")
});