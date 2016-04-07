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
		this.url = rootFbURL + "user/"
		
	}
})

// https://readandramble.firebaseio.com/user/98u34t9u8j349398/posts/

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

				<div className="ReadRamble">

					<h3 className="wordHolder">log in to read&ramble...</h3><br/>

				</div>

			</div>
		)
	},

	_SignUp: function(){
		myAppRouter.navigate("authenticate", {trigger:true})
	},

		_handleLogIn:function(e){
		e.preventDefault();

		var emailInput = e.currentTarget.email.value
		var pwInput = e.currentTarget.password.value
		var authDataObj ={
			email:emailInput,
			password:pwInput
		}

			fbRef.authWithPassword(authDataObj, function(err, authData){
				if(err){
					alert("THE EMAIL ADDRESS OR PASSWORD YOU ENTERED IS NOT VALID")
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
			if(authData){
				var UserRambleColl = new UserRambleCollection()
				UserRambleColl.create({
					username: usernameInput,
					uid: authData.uid
			})
			myAppRouter.navigate("read",{trigger:true})

			}else{
				alert("A USER HAS NOT BEEN CREATED")
			}

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

				<div className="ReadRamble">
					<h3 className="wordHolder">sign up to read&ramble...</h3><br/>
				</div>

			</div>
		)
	}
})

var ReadView = React.createClass({
	render:function(){
		return(
			<div>
				<form>
				<h3 className="signinas">{this.props.username}</h3>
				<h3 className="signup">read&ramble</h3><br/><br/>

				<input id="logoutButton" className="button-primary" type="submit" defaultValue="Log Out" onClick={this._LogOut}/>
				</form>	

				<div className="ReadRamble">
					<h3 className="wordHolder"></h3><br/>
				</div>

				<Tabs showing={this.props.showing}/>

			</div>	
			)
	},

	_LogOut: function(){
		myAppRouter.navigate("login", {trigger:true})
	}
})

var RambleView = React.createClass({
	_cancelRamble: function(){
		location.hash = "read"
	},

	_submitRamble: function(e){
		var title = e.currentTarget.title.value
		console.log('title: ....', title)
		var writeRamble = e.currentTarget.writeRamble.value
		console.log('writeRamble: ....', writeRamble)

	var newRamble = {
		title:title,
		ramble:writeRamble
	}

	var rambleCollection = new UserRambleCollection()

		rambleCollection.create({
					title: newRamble.title,
					ramble: newRamble.ramble
					})

	},

	render:function(){
		return(
			<div>

				<form>
					<h3 className="signinas">{this.props.username}</h3>
					<h3 className="signup">read&ramble</h3><br/><br/>

					<input id="logoutButton" className="button-primary" type="submit" defaultValue="Log Out" onClick={this._LogOut}/>
				</form>	

				<div className="ReadRamble">
					<form onSubmit={this._submitRamble} id = "rambleForm">
						<input type="text" id="title" placeholder="Title"/>
						<textarea type="text" id="writeRamble" placeholder="ramble..."/>
						<div id="scBox">
							<input className="button-primary" type="submit" defaultValue="Submit"/>
							<input className="button-primary" type="submit" defaultValue="Cancel" onClick={this._cancelRamble}/><br/>
						</div>
					</form>
				</div>

				<Tabs showing={this.props.showing}/>

			</div>
			)
	},

	_LogOut: function(){
		myAppRouter.navigate("login", {trigger:true})
	}
})

// components
var Tabs = React.createClass({

	_genTab: function(tabType, i){
		return<Tab key={i} type={tabType} showing={this.props.showing}/>
	},

	render: function(){
		return(
			<div className="tabs">
				{["ramble","read"].map(this._genTab)}
			</div>
			)
	}
})

var Tab = React.createClass({
	_changeRoute: function(){
		location.hash = this.props.type
	},

	render:function(){
		var styleObj = {}
		if (this.props.type === this.props.showing){
			styleObj.borderBottom = "#80DBD4"
		}

		return (
			<div onClick={this._changeRoute} style={styleObj} className="tab">
				<p>{this.props.type}</p>
			</div>	
			)
	}
})


// router
var AppRouter = Backbonefire.Router.extend({
	routes: {
		"login": "showLogIn",
		"authenticate": "showAuth",
		"read": "showRead",
		"ramble": "showRamble",
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

	initialize: function(){
		console.log("app is routting...")
		Backbonefire.history.start()
	}

})

var myAppRouter = new AppRouter()

}

app()
