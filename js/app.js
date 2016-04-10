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

var RambleModel = Backbonefire.Model.extend ({
	defaults: {
		"title":"",
		"content":""
	}
})

var RamblesCollection = Backbonefire.Firebase.Collection.extend ({
	url: "https://readandramble.firebaseio.com/users",
	model: RambleModel,

	initialize: function(uid){
		this.url = `https://readandramble.firebaseio.com/users/${uid}/rambles`
	}
})

// var AllRamblesCollection = Backbonefire.Firebase.Collection.extend ({
// 	url: "https://readandramble.firebaseio.com/users",
// 	model: RambleModel,

// 	initialize: function() {
// 		this.url = `https://readandramble.firebaseio.com/allrambles`
// 	}
// })

// views
var LogInView = React.createClass({
	email: "",
	password: "",

	_getEmail: function(e){
		e.preventDefault()
		this.email = e.target.value
	},

	_getPassword: function(e){
		e.preventDefault()
		this.password = e.target.value
	},

	_handleLogIn: function(){
		this.props.boundSignUserIn(this.email, this.password)
	},

	_handleSignUp: function(){
		this.props.boundSignUserUp(this.email, this.password)
	},

	render: function(){
		return(

			<div>

				<form>
				<input type="text" id="email" placeholder="Email" onChange={this._getEmail}/>
				<input type="password" id="password" placeholder="Password" onChange={this._getPassword}/>

				<h3 className="signup">read&ramble</h3><br/>

				<input className="button-primary" type="submit" defaultValue="Log In" onClick={this._handleLogIn}/>
				<input className="button-primary" type="submit" defaultValue="Sign Up" onClick={this._handleSignUp}/><br/>
				</form>

				<div className="ReadRamble">

					<h3 className="wordHolder">log in to read&ramble...</h3><br/>

				</div>

			</div>
		)
	}

})

var ReadView = React.createClass({

	componentDidMount: function(){
		console.log("did mount")
		var self = this
		this.props.userRambleColl.on("sync", function(){self.forceUpdate()})
	},

	_makeRambleComponent: function(mdl, i){
		console.log("making rmbl component")
		return<SingleRamble rambleData={mdl} key={i}/>
	},

	render:function(){
		return(
			<div>
				<form>
				<h3 className="signinas">{this.props.email}</h3>
				<h3 className="signup">read&ramble</h3><br/><br/>

				<input id="logoutButton" className="button-primary" type="submit" defaultValue="Log Out" onClick={this._LogOut}/>
				</form>	

				<div className="ReadRamble">

					<div className="wordHolder"> {this.props.userRambleColl.map(this._makeRambleComponent)} </div> <br/>

				</div>

				<Tabs showing={this.props.showing}/>

			</div>	
			)
	},

	_LogOut: function(){
		myAppRouter.navigate("login", {trigger:true})
	}
})

var SingleRamble = React.createClass({
	render: function() {
		return(
			<div className="snglRamble">
				<h4 className="rambleTitle">{this.props.rambleData.get("title")}</h4>
				<p className="rambleContent">{this.props.rambleData.get("content")}</p>
			</div>
			)
	}
})

var RambleView = React.createClass({
	_cancelRamble: function(){
		location.hash = "read"
	},

	_getRamble: function(e){
		e.preventDefault()
		var title = e.target.title.value
		console.log('title: ....')
		var content = e.target.content.value
		console.log('writeRamble: ....')

		this.props.userRambleColl.add({
			"title": title,
			"content": content
		})

		console.log("adding to user ramble coll")
		console.log(this.props.userRambleColl)

		window.location.hash="read"

	},

	render:function(){
		return(
			<div>

				<form>
					<h3 className="signinas">{this.props.email}</h3>
					<h3 className="signup">read&ramble</h3><br/><br/>

					<input id="logoutButton" className="button-primary" type="submit" defaultValue="Log Out" onClick={this._LogOut}/>
				</form>	

				<div className="ReadRamble">
					<form id = "rambleForm" onSubmit={this._getRamble}>

						<input type="text" id="title" placeholder="Title"/>
						<textarea type="text" id="content" placeholder="ramble..."/>

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
		"read": "showRead",
		"ramble": "showRamble",
		// "readall": "showAllRamble"
		"*default": "showLogIn"
	},

		initialize: function(){
		console.log("app is routting...")

		this.ref = new Firebase("https://readandramble.firebaseio.com/")
		window.ref=this.ref


		if (!this.ref.getAuth()) {
			location.hash = "login"
		}
	
		this.on("route", function(){
			if (!this.ref.getAuth()) {
				location.hash = "login"
			}
		})

	},

	showLogIn:function(){
		var boundSignUserIn = this._signUserIn.bind(this)
		var boundSignUserUp = this._signUserUp.bind(this)
		DOM.render(<LogInView boundSignUserIn={boundSignUserIn} boundSignUserUp={boundSignUserUp}/>, document.querySelector(".container"))
		window.location.hash = "login"
	},

	_signUserIn: function(sbmttdEmail, sbmttdpassword) {
		console.log(sbmttdEmail, sbmttdpassword)
		this.ref.authWithPassword({
			email:sbmttdEmail,
			password:sbmttdpassword
		}, function(error, authData){
			if(error){
				console.log(error)
			}else{
				location.hash = "ramble"
			}
		})
	},

	_signUserUp: function(sbmttdEmail, sbmttdpassword) {
		var ref = this.ref 
		var boundSignUserIn = this._signUserIn.bind(this)
		var boundSignUserUp = this._signUserUp.bind(this)
		var storeUser = function(userData){
			ref.child("users").child(userData.uid).set({email:sbmttdEmail})
		}
		var handler = function(error, userData) {
			if (error) {
				console.log("A USER HAS NOT BEEN CREATED")
				DOM.render(<LogInView error={error} boundSignUserIn={boundSignUserIn} boundSignUserUp={boundSignUserUp}/>, document.querySelector(".container"))
			}else{
				console.log("User has been created!")
				storeUser(userData)
				boundSignUserIn(sbmttdEmail, sbmttdpassword)
			}
		}
		ref.createUser({
			email: sbmttdEmail,
			password: sbmttdpassword
		}, handler)
	},

	showRead: function(){
		var rc = new RamblesCollection(this.ref.getAuth().uid)
		DOM.render(<ReadView email={this.ref.getAuth().password.email} userRambleColl={rc}/>, document.querySelector(".container"))
		window.location.hash= "read"
	},

	showRamble: function(){
		var rc = new RamblesCollection(this.ref.getAuth().uid)
		DOM.render(<RambleView email={this.ref.getAuth().password.email} userRambleColl={rc}/>, document.querySelector(".container"))
		window.location.hash = "ramble"
	},

})

var myAppRouter = new AppRouter()

Backbonefire.history.start()

}

app()
