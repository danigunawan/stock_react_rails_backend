import React from 'react'

import DashboardAnswersCard from './DashboardAnswersCard'

import '../../css/DashboardAnswers.css'

export default class DashboardAnswers extends React.Component{

	state = {
		allQuestions: [],
		questions: null,
		userAnswers: [],
		userQuestions: [],
		mounted: false,
		updatedAnswers: false,
		updatedAllQuestions: false,
		updatedUserQuestions: false
	}

	componentDidMount(){
		this.setState({
			mounted: true
		})
	}

	componentDidUpdate(){
		if (this.state.mounted && !this.state.updatedAnswers ){
			this.setAnswers()
		}
		if (this.state.mounted && !this.state.updatedAllQuestions) {
			this.setAllQuestions()
		}
		if (this.state.updatedAllQuestions && !this.state.updatedUserQuestions) {
			this.setUserQuestions()
		}
	}

	setAnswers = () => {
		this.setState({
			userAnswers: this.props.user_answers,
			updatedAnswers: true
		})
	}

	setAllQuestions = () => {
		this.setState({
			allQuestions: this.props.all_questions,
			updatedAllQuestions: true
		})
	}

	setUserQuestions = () => {
		if (this.state.updatedAllQuestions && this.state.updatedUserQuestions !== true ) {
			let userAnswerIDs = this.state.userAnswers.map(answer => answer.question_id)
			let userQuestions = this.state.allQuestions.filter(question => userAnswerIDs.includes(question.id))
			this.setState({
				userQuestions: userQuestions,
				updatedUserQuestions: true
			})
		}
	}

	onPageLoadFunctions = (props) => {
		this.props.update_page_data({
			user_id: props.user_id,
			page_name: "user_dashboard_answers"
		})
	}

	render(){
		const distributeCombineQuestionsAnswers =
			(this.state.updatedUserQuestions) ? this.state.userQuestions.map(question =>
					this.state.userAnswers.map(answer =>
						(question.id === answer.question_id) ?
							<DashboardAnswersCard
								key={answer.id}
								question={question}
								answer={answer}
							/>
						: ""
					)
				)
				: ""

		return(
			<div className="answers_wrapper">
				{ distributeCombineQuestionsAnswers }
			</div>
		)
	}
}