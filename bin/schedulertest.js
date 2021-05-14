// var script = document.createElement('script');
// script.src = 'https://code.jquery.com/jquery-3.4.1.min.js';
// script.type = 'text/javascript';
// document.getElementsByTagName('head')[0].appendChild(script);
// <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
// var date = new Date();

// $.post( "/scheduletest", function( data ) {
//     console.log("BIN REQUEST");
//     console.log(date);
//   });

// console.log(date);
var CronJob = require("cron").CronJob;
const axios = require("axios");

var job = new CronJob(
  "1 * * * * *",
  function () {
    console.log(new Date());
    // send a POST request
    axios
      // .get("http://stormy-bastion-99734.herokuapp.com/atlas/app/places/hangouts")
      .get("burntune.herokuapp.com/scheduletest")
      .then((response) => {
        console.log(response.data);
        console.log(")))))))))))))))))))))))))))))))))))))))))))))))))))))))");
      })
      .catch((error) => {
        console.log(error);
      });
  },
  null,
  true,
  "America/Los_Angeles"
);
job.start();
