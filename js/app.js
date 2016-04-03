// es5, 6, and 7 polyfills, powered by babel
import polyfill from "babel-polyfill"

//
// fetch method, returns es6 promises
// if you uncomment 'universal-utils' below, you can comment out this line
import fetch from "isomorphic-fetch"

// universal utils: cache, fetch, store, resource, fetcher, router, vdom, etc
// import * as u from 'universal-utils'

// the following line, if uncommented, will enable browserify to push
// a changed fn to you, with source maps (reverse map from compiled
// code line # to source code line #), in realtime via websockets
// -- browserify-hmr having install issues right now
// if (module.hot) {
//     module.hot.accept()
//     module.hot.dispose(() => {
//         app()
//     })
// }

// Check for ServiceWorker support before trying to install it
// if ('serviceWorker' in navigator) {
//     navigator.serviceWorker.register('./serviceworker.js').then(() => {
//         // Registration was successful
//         console.info('registration success')
//     }).catch(() => {
//         console.error('registration failed')
//             // Registration failed
//     })
// } else {
//     // No ServiceWorker Support
// }

import DOM from 'react-dom'
import React, {Component} from 'react'

import $ from "jquery"
import _ from "underscore"
import Firebase from "firebase"
import Backbonefire from "bbfire"


function app() {

// models

var rootFbURL = "https://readandramble.firebaseio.com/"
var fbRef = new Firebase(rootFbURL)

var UserRambleCollection = Backbonefire.Firebase.Collection.extend({
	url:"",
	initialize: function(){
		this.url = rootFbURL + "userRamble/"
	}
})

// components
var ReadRamble = React.createClass({
	render:function(){
		return(
			<div className="ReadRamble">

			</div>
			)
	}
})

// views
var LogInView = React.createClass({
	render: function(){
		return(
			<div>

				<form onSubmit={this._handleLogIn}>
				<input type="text" id="email" placeholder="Email"/>
				<input type="password" id="password" placeholder="Password"/>
				<h3 className="signup">read&ramble</h3><br/>
				<input className="button-primary" type="submit" defaultValue="Log In"/>
				<input className="button-primary" type="submit" defaultValue="Sign Up" onClick={this._SignUp}/><br/>
				</form>

				<ReadRamble/>
			</div>
		)
	},

	_SignUp: function(){
		myAppRouter.navigate("authenticate", {trigger:true})
	},

		_handleLogIn:function(e){
		e.preventDefault();

		var emailInput = e.currentTarget.email.value
		var pwInput =e.currentTarget.password.value
		var authDataObj ={
			email:emailInput,
			password:pwInput
		}

			fbRef.authWithPassword(authDataObj, function(err, authData){
				if(err){
					alert("sorry credentials not vallid!!")
				}else{
					console.log("user is good to go!")
					myAppRouter.navigate("read",{trigger:true})
				}
			})
	}

})

var AuthView = React.createClass({

	_handleSignUp: function(e){
		var emailInput = e.currentTarget.email.value
		var pwInput = e.currentTarget.password.value
		var usernameInput = e.currentTarget.username.value

		console.log(emailInput, pwInput, usernameInput)

		var newUser = {
			email: emailInput,
			password: pwInput
		}

		fbRef.createUser(newUser, function(err, authData){
			var UserRambleColl = new UserRambleCollection()
			UserRambleColl.create({
				username: usernameInput,
				uid: authData.uid
			})
		})
	},

	render:function(){
		return(
			<div>

				<form onSubmit={this._handleSignUp}>
				<input type="text" id="email" placeholder="Email"/>
				<input type="password" id="password" placeholder="Password"/>
				<h3 className="signup">read&ramble</h3><br/>
				<input type="text" id="username" placeholder="Username"/><br/>
				<input id="RNRButton" className="button-primary" type="submit" defaultValue="read&ramble"/><br/>
				</form>

				<ReadRamble/>
			</div>
		)
	}
})

var ReadView = React.createClass({
	render:function(){
		return(
			<div>
				<form onSubmit={this._handleSignUp}>
				<h3 className="signinas">username</h3>
				<h3 className="signup">read&ramble</h3><br/><br/>

				<input id="logoutButton" className="button-primary" type="submit" defaultValue="Log Out" onClick={this._LogOut}/>
				</form>	

				<ReadRamble/>	
			</div>	
			)
	},

	_LogOut: function(){
		myAppRouter.navigate("login", {trigger:true})
	}
})


// router
var AppRouter = Backbonefire.Router.extend({
	routes: {
		"login": "showLogIn",
		"authenticate": "showAuth",
		"read": "showRead",
		"ramble": "showRamble",
		// "faves" : "showFaves"
		"*default": "showLogIn"
	},

	showLogIn:function(){
		DOM.render(<LogInView/>, document.querySelector(".container"))
	},

	showAuth: function(){
		DOM.render(<AuthView/>, document.querySelector(".container"))
	},

	showRead: function(){
		DOM.render(<ReadView/>, document.querySelector(".container"))
	},

	showRamble: function(){
		DOM.render(<RambleView/>, document.querySelector(".container"))
	},

	// showFaves: function(){
	// 	DOM.render(<FavesView/>, document.querySelector(".container"))
	// },

	initialize: function(){
		console.log("app is routting...")
		Backbonefire.history.start()
	}

})

var myAppRouter = new AppRouter()

}

app()
