import React from 'react'
import { Redirect } from 'react-router'

import trafficFunctions from '../utility/trafficFunctions'
import authFunctions from '../utility/authFunctions'

import './LogIn.css'

export default class LogIn extends React.Component {

	state = {
		loggedIn: false,
		cancel: false,
		user_name: "",
		password: "",
		errors: [],
	}

	pageInfo = {
		user_id: this.props.user_id,
		page_name: 'log_in',
	}

	componentDidMount(){
		this.onPageLoadFunctions()
	}

	onChange = (event) => {
		this.setState({
			[event.target.name]: event.target.value
		})
	}

	onSubmitLoginFunctions = async (event) => {
		this.logInSubmitted(event)
	}

	logInSubmitted = (event) => {
		event.preventDefault()
		event.persist()

		let logInObj = {
			user_name: this.state.user_name,
			password: this.state.password
		}

		authFunctions('logIn', 'http://localhost:3001/login', logInObj)
		.then(res_obj => {
			if (res_obj.errors) {
				this.setState({ errors: res_obj.errors })
			} else {
				this.props.setToken(res_obj)
				this.props.updateLogin()
				this.setState({ loggedIn: true })
				this.onSubmitTrafficFunctions(event, res_obj)
			}
		})
	}

	onCancelFunctions = (event) => {
		this.onClickTrafficFunctions(event)
		this.setState({ cancel: true })
	}

	onClickTrafficFunctions = (event) => {
		let elementInfo = {
			user_id: this.props.user_id,
			interaction: event.target.attributes.interaction.value,
			element: event.target.name
		}

		trafficFunctions('element', 'http://localhost:3001/traffics', elementInfo)
	}

	onSubmitTrafficFunctions = (event, res_obj) => {
		let elementInfo = {
			user_id: res_obj.user_id,
			interaction: event.target.attributes.interaction.value,
			element: event.target.name
		}

		trafficFunctions('element', 'http://localhost:3001/traffics', elementInfo)
	}

	onPageLoadFunctions = () => {
		trafficFunctions('page', 'http://localhost:3001/pages', this.pageInfo)
	}

	render(){

		const errors = (!!this.state.errors) ?
			( <div className="default_error_report" key={"log_in_error_report"}>
					{ this.state.errors.map( error =>
						<div className="default_error_item">
							{ error }
						</div>
					)}
				</div>)
			:
				( "" )

		const login_form =
			<div className="default_wrapper">
				<div className="alt_header">
					<h3>Log In</h3>
				</div>
				<form
					name="log_in_form"
					interaction="submit"
					className="log_in_form"
					onSubmit={ this.onSubmitLoginFunctions }
				>
					{ errors }
					<div className="log_in_div">
						<label htmlFor="log_in_user_name">User Name</label>
						<br />
						<input
							id="log_in_user_name"
							type="text"
							name="user_name"
							onChange={ this.onChange }
							value={ this.state.user_name }
						/>
						<br />
						<label htmlFor="log_in_password">Password</label>
						<br />
						<input
							id="log_in_password"
							type="password"
							name="password"
							onChange={ this.onChange }
							value={ this.state.password }
						/>
					</div>
					<div className="log_in_buttons_container">
						<input
							className="alt_button"
							type="submit"
						/>
						<input
							type="reset"
							name="Log In Form"
							interaction="Cancel"
							className="alt_button"
							onClick={ this.onCancelFunctions }
							value="Cancel"
						/>
					</div>
				</form>
			</div>

		return (
			<>
				{
					{
						true: (() => {
							switch(this.state.cancel) {
								case true: return <Redirect to='/' />
								case false: return login_form
								default: return null;
							}
						})(),
						false: <Redirect to='/' />
					}[!(this.state.loggedIn)]
				}
			</>
		)
	}
}