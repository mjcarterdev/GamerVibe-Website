"use strict";

const mainNav = document.getElementById("js-menu");
const navToggleBtn = document.getElementById("js-navbar-toggle");
const searchTab = document.getElementById("js-search-tab");
const homeTab = document.getElementById("js-home-tab");
const discoverTab = document.getElementById("js-discover-tab");
const followersTab = document.getElementById("js-followers-tab");
const accountTab = document.getElementById("js-account-tab");
const loginTab = document.getElementById("js-login-tab");
const logoutTab = document.getElementById("js-logout-tab");
const signupTab = document.getElementById("js-signup-tab");
const loggedInTab = document.querySelectorAll(".loggedInTab");
const profileContainer = document.getElementById("js-profile-container");
const likeBtn = document.getElementById("js-like-btn");
let clickedPostId = sessionStorage.getItem("postId");

// selects navigation tabs to be toggled if a user is logged in.
const toggleLoggedInTabs = () => {
  loggedInTab.forEach((element) => {
    element.classList.toggle("hide");
  });
};

//  Logs out user and removes user and token
const logout = async () => {
  try {
    const options = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    const response = await fetch(url + "/auth/logout", options);
    const json = await response.json();
    console.log(json);
    // remove token
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("moderator_since");
    sessionStorage.removeItem("clickedPostUserId");

    alert(json.message);
    window.location.href = "/";
  } catch (e) {
    console.log(e.message);
  }
};

// Toggle function for mobiles and smaller screens
const toggleMenu = () => {
  mainNav.classList.toggle("show");
};

const toggleProfileBanner = () => {
  if (profileContainer) {
    console.log("toggle profile called");
    profileContainer.style.display = "none";
  }
};

/* main calls from here on...*/

//test to see if users are logged in
if (user != null) {
  if (userModeratorStatus == null) {
    userType = "registered";
    console.log("user type is: " + userType);
  } else {
    userType = "moderator";
    console.log("user type is: " + userType);
  }
  toggleLoggedInTabs();
} else {
  toggleProfileBanner();
}

//event listeners
navToggleBtn.addEventListener("click", toggleMenu);

logoutTab.addEventListener("click", logout);