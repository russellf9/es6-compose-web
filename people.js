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
		
		// ==== STATE ====
    var url = () => { return 'https://randomuser.me/api/?results=5'; };

		// ==== JQUERY HELPERS ====
		const append = (container, value) => {
			return $(container).append(value)
		}
	

		// ==== JQUERY ELEMENTS ====
    var img = (url) => { return $('<img />', { src: url }); };
		
		
		
		// ==== BOOTSTRAP ELEMENTS ====
		const createPersonContainer = `<div class="col-sm-6 col-sm-offset-3">
																		</div>`
		const getRow = () => { return $(`<div class="row"></div>`) }
		const getCard = () => { return $(`<div class="person-card grey-border">`)}
		const getThumb = () => { return $(`<div class="thumbnail pull-right"></div>`)}
		
		
		// ==== GET DATA FROM JSON RESPONSE ====
		const getTitle = _.compose(_.prop('title'), _.prop('name'));
		const getFirstName = _.compose(_.prop('first'), _.prop('name'));
		const getLastName = _.compose(_.prop('last'), _.prop('name'));
		const getThumbnail = _.compose(_.prop('thumbnail'), _.prop('picture'))
	
		
		// ==== UTILITY COMPOSITIONS ====
		const createImage = _.compose(img, getThumbnail)
	
		// ==== HTML CREATION ====
		const createName = (value) => {
			const title = getTitle(value)
			const firstName = getFirstName(value)
			const lastName = getLastName(value)
			return $(`
				<div class="caption pull-left">
					 <h3 class="person-name">${title} ${firstName} ${lastName}</h3>
							<p>content</p>
				</div>
				`)
		}
	
		const addParagraph = (accum, value) => {
			const row = getRow()
			const card = getCard()
			const name = createName(value)
			const thumb = getThumb()
			const image = createImage(value)
			
			append(thumb, image)	
			append(card, thumb)		
			append(card, name)
			append(row, card)	
				
			return append(accum, row)
		}
		
		// ==== REDRAW THE APP CONTENT ===
		
		const createPerson = _.compose(addParagraph)
		const people = _.compose(_.reduce(createPerson, createPersonContainer), _.prop('results'))
		const renderPeople = _.compose(Impure.setHtml('#list'), people)
		
		
		var app = _.compose(Impure.getJSON(renderPeople), url)
		
		app("people")
});