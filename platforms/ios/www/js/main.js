var app = {
/*
    //creates the search function that is used on the front page
    findByName: function() {
        console.log('findByName');
        this.store.findByName($('.search-key').val(), function(employees) {
            var l = employees.length;
            var e;
            $('.employee-list').empty();
            for (var i=0; i<l; i++) {
                e = employees[i];
                $('.employee-list').append('<li><a href="#employees/' + e.id + '">' + e.firstName + ' ' + e.lastName + '</a></li>');
            }
        });
    },
/* HAS BEEN MOVED TO HOMEVIEW.JS
    //creates the search function that is used on the front page based on a template
    findByName: function() {
        var self = this;
        this.store.findByName($('.search-key').val(), function(employees) {
            $('.employee-list').html(self.employeeLiTpl(employees));
        });
    },
*/

/* HAS BEEN MOVED TO HOMEVIEW.JS
    //create the html for the front page and render it all client-side
    renderHomeView: function() {
     var html =
                "<div class='header'><h1>Home</h1></div>" +
                "<div class='search-view'>" +
                "<input class='search-key'/>" +
                "<ul class='employee-list'></ul>" +
                "</div>"
        $('body').html(html);
        $('.search-key').on('keyup', $.proxy(this.findByName, this));
    },



//create the html for the front page and render it all client-side using the template instead of hard code (see above)
renderHomeView: function() {
    $('body').html(this.homeTpl());
    $('.search-key').on('keyup', $.proxy(this.findByName, this));
},

initialize: function() {
    var self = this;

    //renders the HomeView from above, avoid page refreshes
    this.store = new MemoryStore(function() {
        self.renderHomeView();
    });

     //using handlebars.js we can create HTML templates to use across pages
    this.homeTpl = Handlebars.compile($("#home-tpl").html());
    this.employeeLiTpl = Handlebars.compile($("#employee-li-tpl").html());
}

*/

//allows for messages to show up in their native display (browser/mobile)
    showAlert: function (message, title) {
    if (navigator.notification) {
        navigator.notification.alert(message, null, title, 'OK');
    } else {
        alert(title ? (title + ": " + message) : message);
    }
},

//Touch events and setting them to active to change their background color
registerEvents: function() {
    var self = this;

    //event listener that checks for URL hash tag changes
    $(window).on('hashchange', $.proxy(this.route, this));

    // Check of browser supports touch events...
    if (document.documentElement.hasOwnProperty('ontouchstart')) {
        // ... if yes: register touch event listener to change the "selected" state of the item
        $('body').on('touchstart', 'a', function(event) {
            $(event.target).addClass('tappable-active');
        });
        $('body').on('touchend', 'a', function(event) {
            $(event.target).removeClass('tappable-active');
        });
    } else {
        // ... if not: register mouse events instead
        $('body').on('mousedown', 'a', function(event) {
            $(event.target).addClass('tappable-active');
        });
        $('body').on('mouseup', 'a', function(event) {
            $(event.target).removeClass('tappable-active');
        });
    }
},

//looks for a hashtag, if it doesn't find one it displays the frontpage, otherwise it displays the employee pages
route: function() {
    var hash = window.location.hash;
    if (!hash) {
        $('body').html(new HomeView(this.store).render().el);
        return;
    }
    var match = hash.match(app.detailsURL);
    if (match) {
        this.store.findById(Number(match[1]), function(employee) {
            $('body').html(new EmployeeView(employee).render().el);
        });
    }
},

initialize: function() {
    var self = this;

    //matches employee details urls
    this.detailsURL = /^#employees\/(\d{1,})/;

    this.registerEvents();

    this.store = new MemoryStore(function() {
        self.route();
    });
}


};

app.initialize();