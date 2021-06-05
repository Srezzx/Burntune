//landing page forgot password ajax call
$("#forgotPasswordForm").submit(function (event) {
  $("#loader2").css("display", "block");
  event.preventDefault();
  var email = $("#forgotPasswordForm").find('input[name="forgot_email"]').val();
  var fields = { forgot_email: email };
  $.ajax({
    url: "/forgotpassword",
    type: "POST",
    data: fields,
    success: function (result) {
      console.log(result);
      if (result.status === "Success") {
        $("#forgotpassword_modal_p")[0].innerHTML = result.msg;
        $("#forgotpassword_modal_p").css("color", "green");
        $("#forgotpassword_modal_p").css("font-size", "110%");
        $("#loader2").css("display", "none");
        setTimeout(function () {
          $("#forgotpasswordModal").modal("hide");
        }, 1000);
      } else if (result.status === "Error") {
        $("#forgotpassword_modal_p")[0].innerHTML = result.msg;
        $("#forgotpassword_modal_p").css("color", "red");
        $("#forgotpassword_modal_p").css("font-size", "110%");
        $("#loader2").css("display", "none");
      }
    },
    error: function (err) {
      $("#login_modal_p")[0].innerHTML =
        "An error has occoured, please try again in sometime";
      $("#login_modal_p").css("color", "red");
      $("#login_modal_p").css("font-size", "110%");
      $("#loader2").css("display", "none");
    },
  });
});

//landing page signin ajax call
$("#loginform").submit(function (event) {
  $("#loader3").css("display", "block");
  event.preventDefault();
  var nickname = $("#loginform")
    .find('input[name="login_username"]')
    .val()
    .toLowerCase();
  var password = $("#loginform").find('input[name="login_password"]').val();
  var fields = { username: nickname, password };
  $.ajax({
    url: "/login",
    type: "POST",
    data: fields,
    success: function (result) {
      if (result.status === "Success") {
        $("#login_modal_p")[0].innerHTML = result.msg;
        $("#login_modal_p").css("color", "green");
        $("#login_modal_p").css("font-size", "110%");
        $("#loader3").css("display", "none");
        setTimeout(function () {
          $("#signInModal").modal("hide");
        }, 1000);
        setTimeout(function () {
          window.location = "/profile/" + result.userid;
        }, 1000);
      } else if (result.status === "Error") {
        $("#login_modal_p")[0].innerHTML = result.msg;
        $("#login_modal_p").css("color", "red");
        $("#login_modal_p").css("font-size", "110%");
        $("#loader3").css("display", "none");
      }
    },
    error: function (err) {
      $("#login_modal_p")[0].innerHTML =
        "An error has occoured, please try again";
      $("#login_modal_p").css("color", "red");
      $("#login_modal_p").css("font-size", "110%");
      $("#loader3").css("display", "none");
    },
  });
});

//landing page signup ajax call function

function regsubmit() {
  $("#loader4").css("display", "block");
  event.preventDefault();
  var nickname = $("#registerform")
    .find('input[name="register_username"]')
    .val();
  var password = $("#registerform")
    .find('input[name="register_password"]')
    .val();
  var name = $("#registerform").find('input[name="register_name"]').val();
  var email = $("#registerform").find('input[name="register_email"]').val();
  var phone = $("#registerform").find('input[name="register_phone"]').val();
  var fields = { username: nickname, phone, password, name, email };
  $.ajax({
    url: "/register",
    type: "POST",
    data: fields,
    success: function (result) {
      console.log(result);
      if (result.status === "Success") {
        $("#register_modal_p")[0].innerHTML = result.msg;
        $("#register_modal_p").css("color", "green");
        $("#register_modal_p").css("font-size", "110%");
        $("#loader4").css("display", "none");
        setTimeout(function () {
          $("#signUpModal").modal("hide");
        }, 1000);
        setTimeout(function () {
          window.location = "/profile/" + result.userid;
        }, 1000);
      } else if (result.status === "Error") {
        $("#register_modal_p")[0].innerHTML = result.msg;
        $("#register_modal_p").css("color", "red");
        $("#register_modal_p").css("font-size", "110%");
        $("#loader4").css("display", "none");
      }
    },
    error: function (err) {
      alert("An error has occoured, please try again in sometime");
      $("#register_modal_p")[0].innerHTML =
        "An error has occoured, please try again in sometime";
      $("#register_modal_p").css("color", "red");
      $("#register_modal_p").css("font-size", "110%");
      $("#loader4").css("display", "none");
    },
  });
}

//togglemodal
function toggleModal(a, b) {
  a = "#" + a;
  b = "#" + b;
  $(b).modal("toggle");
  $(a).modal("toggle");
}

//  Register next javascript
var currentTab = 0;
showTab(currentTab);

function showTab(n) {
  var x = document.getElementsByClassName("register_tab");
  x[n].style.display = "block";
  if (n == 0) {
    document.getElementById("register_prevBtn").style.display = "none";
  } else {
    document.getElementById("register_prevBtn").style.display = "inline";
  }
  if (n == x.length - 1) {
    document.getElementById("register_nextBtn").innerHTML = "Submit";
  } else {
    document.getElementById("register_nextBtn").innerHTML = "Next";
  }
  fixStepIndicator(n);
}

function nextPrev(n) {
  // This function will figure out which tab to display
  var x = document.getElementsByClassName("register_tab");
  // Exit the function if any field in the current tab is invalid:
  if (n == 1 && !validateForm()) {
    return false;
  }
  // Hide the current tab:

  // Increase or decrease the current tab by 1:
  currentTab = currentTab + n;
  // if you have reached the end of the form...
  if (currentTab < x.length) {
    x[currentTab - n].style.display = "none";
  }
  if (currentTab >= x.length) {
    // ... the form gets submitted:
    regsubmit();
  }
  // Otherwise, display the correct tab:
  showTab(currentTab);
}
function validateForm() {
  var x,
    y,
    i,
    valid = true;
  x = document.getElementsByClassName("register_tab");
  y = x[currentTab].getElementsByClassName("register_input_real");
  // A loop that checks every input field in the current tab:
  for (i = 0; i < y.length; i++) {
    // If a field is empty...
    if (y[i].value == "") {
      // add an "invalid" class to the field:
      y[i].className += " invalid";
      // and set the current valid status to false
      valid = false;
    }
  }
  // If the valid status is true, mark the step as finished and valid:
  if (valid) {
    document.getElementsByClassName("step")[currentTab].className += " finish";
  }
  return valid; // return the valid status
}

function fixStepIndicator(n) {
  var i,
    x = document.getElementsByClassName("step");
  for (i = 0; i < x.length; i++) {
    x[i].className = x[i].className.replace(" active", "");
  }
  //... and adds the "active" class on the current step:
  x[n].className += " active";
}
