import React from 'react'

import DBeditQuestionsTable from './DBeditQuestionsTable'
import DBeditQuestionInfo from './DBeditQuestionInfo'
import DBeditAddQuestion from './DBeditAddQuestion'
import DBeditEditQuestion from './DBeditEditQuestion'
import DBeditDeleteQuestion from './DBeditDeleteQuestion'

import {
        //  Link
        } from 'react-router-dom'

import '../DBedit.css'

export default class DBeditQuestionsContainer extends React.Component{

	state = {
		questions: [],
		question: {},
		question_id: '',
		display: "index"
	}

	componentDidMount(){
		this.getQuestionDB()
	}

	UNSAFE_componentWillReceiveProps(nextProps){
		this.setState({
			display: "index"
		})
	}

	getQuestionDB = () => {
		fetch("http://localhost:3001/questions")
	    .then(res => res.json())
	    .then(res_obj =>
			this.setState({
				questions: res_obj.data
			})
		)
	}

	updateIndex = (question) => {
		this.setState({
			question: question
		},this.getQuestionDB())
	}

	displaySwitch = (question) => {
		this.setState({
			display: "question_info",
			question: question
		})
	}

	displaySwitchToIndex = (index) => {
		this.setState({
			display: 'index',
		}, this.getQuestionDB())
	}

	displaySwitchToQuestionInfo = (question) => {
		this.setState({
			display: "question_info",
			question: question
		})
	}

	displaySwitchtoAdd = () => {
		this.setState({
			display: "add_question"
		})
	}

	displaySwitchtoEdit = (question) => {
		// console.log(question)
		this.setState({
			display: "edit_question",
			question: question
		})
	}

	displaySwitchToDelete = (question_id) => {
		this.setState({
			display: "delete_question",
			user_id: question_id
		})
	}

	render(){
		// console.log(this.state)

		const distribute_questions_data = this.state.questions.map( question_obj =>
			<DBeditQuestionsTable
				key={question_obj.id}
				question={question_obj}
				displaySwitchToQuestionInfo={ this.displaySwitchToQuestionInfo }
			/>
		)

		const DBedit_table_frame =
	 		<table className="DBedit_table">
				<tbody>
	 			<tr>
					<th>ID</th>
	 				<th>Question</th>
	 				<th>Difficulty</th>
	 				<th>Category</th>
	 				<th>Correct Answer</th>
	 				<th>Incorrect Answers</th>
	 			</tr>
	 				{ distribute_questions_data }
	 			</tbody>
	 		</table>

		const index_buttons = [
				<button className="default_button" value="Add Question" onClick={ this.displaySwitchtoAdd }>
					Add Question
				</button>
		]

		const DBedit_index = [
			index_buttons,
			DBedit_table_frame
		]

		return(
			<>
				{
					(() => {
						switch(this.state.display) {
							case 'question_info': return <DBeditQuestionInfo
														displaySwitchToIndex={ this.displaySwitchToIndex }
														displaySwitchtoEdit={ this.displaySwitchtoEdit }
														displaySwitchToDelete={ this.displaySwitchToDelete }
														question={ this.state.question }
													/>;
							case 'add_question': return <DBeditAddQuestion
														displaySwitchToIndex={ this.displaySwitchToIndex }
													/>;
							case 'edit_question': return <DBeditEditQuestion
														displaySwitchToQuestionInfo={ this.displaySwitchToQuestionInfo }
														updateIndex={ this.updateIndex }
														question={ this.state.question }
													/>;
							case 'delete_question': return <DBeditDeleteQuestion
														displaySwitchToIndex={ this.displaySwitchToIndex }
														displaySwitchToQuestionInfo={ this.displaySwitchToQuestionInfo }
														question={ this.state.question }
													/>;
							case 'index': return DBedit_index;
						default: return null;
						}
					})()
				}
			</>
		)
	}
}