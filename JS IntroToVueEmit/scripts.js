// Quinn Douglas Scrivner, Markley is my favorite
Vue.component("sum", {
  // second component for use of emitter and summary at end
  //My favorite part of my summary is the math works, and even one is set to zero, it can be put back up to say 2 and the math STILL WORKS.
  template: `
        <div id="Summary"> 
        <h1 id="bigTitle">Movie {{overviews}}</h1> {{childtick}} Childrens Tickets at $ {{childamount*childtick}}, {{adulttick}} Adult Tickets at $ {{adultamount*adulttick}}, Subtotal $ {{childamount*childtick+adultamount*adulttick}},
        <button id="removed" @click="RemoveAdultMovie">Remove Adult Ticket</button><button id="removed" @click="RemoveChildMovie">Remove Childrens Ticket</button><button id="removed" @click="Delete">Delete</button>
        </div>
  `,
  //empty becasuse they are not needed, but not forgotten
  props: [
    "overviews",
    "pictures",
    "childtick",
    "adulttick",
    "adultamount",
    "childamount",
    "tickets",
  ],

  data() {
    return {};
  },
  methods: {
    //These three methods delete tickets purchased, and can delete the movie as a whole
    RemoveAdultMovie() {
      this.adulttick--;
      if (this.adulttick <= 0) {
        this.adulttick = "No";
      }
    },
    RemoveChildMovie() {
      this.childtick--;
      if (this.childtick <= 0) {
        this.childtick = "No";
      }
    },
    Delete() {
      this.tickets.pop();
    },
  },
});
//The beautiful movie component
Vue.component("moviecomp", {
  //if you hover over my movies, the buttons will appear
  template: `<div id="something" @mouseover="hover = true" @mouseleave="hover = false">
  <div>
  <h1 id=centerIt>{{overviews}}</h1>

  <img v-bind:src=link+pictures>
  <div id="dropUp">
    <button id="Adult" v-if="hover" @click="adultclicked" >Adult $6.99 {{adulttickets}}</button>
    <button id="Child" v-if="hover" @click="childclicked" >Child $3.99 {{childtickets}}</button>
</div>
  </div>
  </div>`,
  //props from last project
  props: ["overviews", "pictures"],
  //the data from last project
  data() {
    return {
      //Included in here is the default link, then the beginning of a long train for the adult/child tickets
      link: "https://image.tmdb.org/t/p/w500",
      //hover false leading to CSS that makes my buttons only appear if you hover over the movie
      hover: false,
      adulttickets: 0,
      childtickets: 0,
    };
  },
  //methods from the last project and this project
  methods: {
    //when the buttons for adult and/or child are pressed add one to each
    adultclicked() {
      //obvi. click the button to add it to the cart/ add one (same for child)
      this.adulttickets++;
      this.$emit(
        "attickets",
        this.overviews,
        this.pictures,
        this.adulttickets,
        this.childtickets
      );
    },
    childclicked() {
      this.childtickets++;
      this.$emit(
        "cdtickets",
        this.overviews,
        this.pictures,
        this.adulttickets,
        this.childtickets
      );
    },
  },
});
//Hey! I remembered how to do it
const movies = new Vue({
  //location
  el: "#movies",
  //variables
  data: {
    //Super Secret messgae
    message: "Movie Mania (Patent Pending)",
    //once again, default link
    link: "https://image.tmdb.org/t/p/w500",
    //kinda hard code, I see it as softcode because it's needed to make it look like tickets are actually being bought
    adultPrice: 6.99,

    childPrice: 3.99,

    //For upcoming projects, probably
    upcomingMoves: "Upcoming Movies",
    //Empty array that gets filled later
    ticketsPurchased: [],

    //The big Kahuna, Movie array to put each movie into it's own, category, spot in line
    //the OG
    movie: [
      // //four different movies, four different positions of the array
      // {
      //   original_title: "The Incredibles",
      //   backdrop_path: "images/incredibles.jpg",
      //   overview:
      //     "In this lauded Pixar animated film, married superheroes Mr. Incredible (Craig T. Nelson) and Elastigirl (Holly Hunter) are forced to assume mundane lives as Bob and Helen Parr after all super-powered activities have been banned by the government.",
      // },
      // {
      //   original_title: "Shark Tales",
      //   backdrop_path: "images/sharktales.jpg",
      //   overview:
      //     "It tells the story of a fish named Oscar (Smith) who falsely claims to have killed Frankie (Imperioli), the son of a shark mob boss named Don Lino (De Niro), to advance his community standing and teams up with the mobster's other son Lenny (Black) to keep up the other facade.",
      // },
      // {
      //   original_title: "DodgeBall",
      //   backdrop_path: "images/dodgeball.jpg",
      //   overview:
      //     "Average Joe's Gym and its owner, Peter La Fleur (Vince Vaughn), are both down on their luck. A fancy competing gym called Globo-Gym, run by the maniacal health nut White Goodman (Ben Stiller), is about to put Average Joe's out of business unless Peter can raise $50,000 to keep his mortgage.",
      // },
      // {
      //   original_title: "Spider-Man 2",
      //   backdrop_path: "images/spiderman.jpg",
      //   overview:
      //     "When a failed nuclear fusion experiment results in an explosion that kills his wife, Dr. Otto Octavius (Alfred Molina) is transformed into Dr. Octopus, a cyborg with deadly metal tentacles.",
      // },
    ],
  },
  //Functions
  methods: {
    //Everytime you click the button, a new random number is printed and a new overview is outputed
    randMovie() {
      //Straight from the midterm V
      var randomNum1 = Math.floor(Math.random() * 19);
      //Softcode
      //Another OG for random overviews
      var overview = document.getElementById("bigPicture");
      //Classic JS force changing the innerHTML of the div with a question mark on it
      overview.innerHTML =
        this.movie[randomNum1].overview +
        " " +
        `<p id="formatIt">` +
        this.movie[randomNum1].title +
        `</p>`;
    },
    //The BTS of how my movies even appear
    useAPI() {
      axios
        .get(
          "https://api.themoviedb.org/3/movie/now_playing?api_key=abe8c274af0dc3b9b300a4f3a1129937&language=en-US&page=1"
        )
        .then((response) => {
          console.log(response);
          console.log(response.data.results);
          this.movie = response.data.results;
        });
    },
    //connecting to the empty array, this is the setup of my summary, as it's constantly getting vars from multiple sources to keep everything in the summary up to date
    update(over, pic, adultT, childT, adultam, childam) {
      var bought = {
        //putting info into varaible into array into component
        pic: pic,
        title: over,
        adult: adultT,
        child: childT,
        adultprice: adultam,
        childprice: childam,
      };
      //This is the reason there isn't several divs of each update of the array, it will only make a new line if the title of the movie changes
      for (i = 0; i < this.ticketsPurchased.length; i++) {
        if (this.ticketsPurchased[i].title == over) {
          this.ticketsPurchased.splice(i, 1);
        }
      }
      //.push is easily my favorite method of C#/JS
      this.ticketsPurchased.push(bought);
    },
    //The name of the game here was CONSTANT UPDATE, give each method all the information/user input that it needs to constantly update things
    //Many of my methods are doubled as there's always two variables Child and Adult, much like the midterm and my controllers
    updateChild(overviews, pictures, adult, child) {
      //This is the most recent update, nothing is diplayed is one is less than one
      if (child > 0 || adult < 0) {
        //My favorite part, again CONSTANT UPDATES, easily the most params i've sent in one function
        this.update(
          overviews,
          pictures,
          adult,
          child,
          this.adultPrice,
          this.childPrice
        );
      }
      // showHide.innerHTML +=  "Childs Ticket for " + overviews + ", " + this.childtickets + " at " + this.childPrice*this.childtickets;
    },
    updateAdult(overviews, pictures, adult, child) {
      if (adult > 0 || child < 0)
        this.update(
          overviews,
          pictures,
          adult,
          child,
          this.adultPrice,
          this.childPrice
        );

      // showHide.innerHTML +=   "Adult Ticket for " + overviews +  this.adulttickets + " at " + this.adultPrice*this.adulttickets;
    },

    // {
    //   // showHide.innerHTML = "Number of adult tickets purchased: " + this.adulttickets + "<br></br>" + "Number of children tickets purchased: " + this.childtickets;
    //   showHide.innerHTML = overviews + "Tickets" + childtickets + "Tickets" + adulttickets;
    // },
  },
  //mounted == Windows.Load
  mounted() {
    axios
      .get(
        "https://api.themoviedb.org/3/movie/now_playing?api_key=abe8c274af0dc3b9b300a4f3a1129937&language=en-US&page=1"
      )
      .then((response) => {
        console.log(response);
        this.movie = response.data.results;
      });
  },
});
//My button to show/hide the summary :]
var showHide = document.getElementById("summary");
var showHideSummary = document.getElementById("summaryButton");
showHideSummary.addEventListener("click", () => {
  if (showHide.style.display === "none") {
    showHide.style.display = "block";
  } else {
    showHide.style.display = "none";
  }
});
